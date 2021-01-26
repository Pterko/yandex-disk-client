import got, { Got } from 'got';
import { CookieJar } from 'tough-cookie';

import YaAuth from './ya/ya-auth';
import YaResources from './ya/ya-resources';
import GenericOptions from './interfaces/genericOptions';
import Quota from './interfaces/yandex/Quota';
import Resource from './interfaces/yandex/Resouce';
import { processPath } from './utils';

export class YandexDiskClientAuth {
  private login: string;
  private password: string;
  private httpClient: Got;
  private auth: YaAuth;

  private skToken: string | undefined;
  private idClient: string | undefined;
  private CookieJar: CookieJar;

  private internalOptions?: GenericOptions;

  constructor(
    login: string,
    password: string,
    internalOptions?: GenericOptions
  ) {
    this.login = login;
    this.password = password;

    this.CookieJar = new CookieJar();
    this.httpClient = this.createHttpClientInstance(this.CookieJar);

    this.auth = new YaAuth(
      this.login,
      this.password,
      this.httpClient,
      internalOptions
    );
    this.internalOptions = internalOptions;
  }

  private createHttpClientInstance(CookieJar: CookieJar): Got {
    return got.extend({
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
      },
      cookieJar: CookieJar,
    });
  }

  async logIn(): Promise<boolean> {
    // console.log(`Logging in using login ${this.login}`);

    const preauthResult = await this.auth.YadPreAuthRequest();
    // console.log('preauth result: ', preauthResult);

    const loginRequest = await this.auth.YadAuthLoginRequest(
      preauthResult.csrf,
      preauthResult.uuid
    );

    const passwordRequest = await this.auth.YadAuthPasswordRequest(
      preauthResult.csrf,
      loginRequest.track_id
    );

    const accountsRequest = await this.auth.YadAuthAccountsRequest(
      preauthResult.csrf
    );

    const diskSkResult = await this.auth.YadAuthDiskSkRequest();

    // console.log('diskSkResult', diskSkResult);

    this.skToken = diskSkResult.skToken;
    this.idClient = diskSkResult.idClient;
    return true;
  }

  getClientInstance(): YandexDiskClient {
    if (this.skToken && this.idClient) {
      return new YandexDiskClient(
        this.httpClient,
        this.skToken,
        this.idClient,
        this.internalOptions
      );
    }
    throw new Error('Not logged in');
  }

  async loginTroughtAuthObject(authObject: {
    skToken: string;
    idClient: string;
    cookieJar: any;
  }): Promise<boolean> {
    this.skToken = authObject.skToken;
    this.idClient = authObject.idClient;
    this.CookieJar = CookieJar.fromJSON(authObject.cookieJar);
    this.httpClient = this.createHttpClientInstance(this.CookieJar);

    // Now we need to test that given parameters are valid //
    const tempClient = this.getClientInstance();

    const res = await tempClient.getQuota();

    return true;
  }

  getAuthObject(): {
    skToken: string;
    idClient: string;
    cookieJar: any;
  } {
    return {
      skToken: this.skToken || '',
      idClient: this.idClient || '',
      cookieJar: this.CookieJar.toJSON(),
    };
  }
}

/**
 * This class should be received through `getClientInstance` method of `YandexDiskClientAuth` class. **Do not use this class directly!**
 */
export class YandexDiskClient {
  private yaResources: YaResources;

  constructor(
    httpClient: Got,
    skToken: string,
    idClient: string,
    internalOptions?: GenericOptions
  ) {
    this.yaResources = new YaResources(
      httpClient,
      idClient,
      skToken,
      internalOptions
    );
  }

  public async getQuota(): Promise<Quota> {
    return this.yaResources.getQuota();
  }

  /**
   *   Returns an array of resources for a given folder.
   */
  public async getFolderResources(
    path: string,
    options = { withParent: false }
  ): Promise<Resource[]> {
    return this.yaResources.getFolderResources(path, options);
  }

  /** Returns a https link to requested file */
  public async getFileDownloadUrl(path: string): Promise<string> {
    return this.yaResources.getFileDownloadUrl(path);
  }

  /** Used to upload buffer to yandex.disk */
  public async uploadFile(
    buffer: Buffer,
    path: string
  ): Promise<{ status: string; resource?: Resource }> {
    return this.yaResources.uploadFile(path, buffer);
  }

  /** Used to create a folder. Don't support recursive creation. */
  public async createFolder(
    path: string,
    options = { isRecursive: false }
  ): Promise<boolean> {
    if (options.isRecursive) {
      const processedPath = processPath(path);
      // we have a long path like '/disk/test/qwe/folder' and we need recursively test and create folders if needed
      const parts: string[] = processedPath
        .split('/')
        .filter(x => x.length > 0);

      const testingPaths: string[] = [];

      for (let i = 2; i <= parts.length; i++) {
        testingPaths.push('/' + parts.slice(0, i).join('/'));
      }

      // console.log('testingPaths', testingPaths);

      for (const path of testingPaths) {
        try {
          // console.log('testing path:', path);
          const isExists = await this.yaResources.getFolderResources(path, {
            withParent: true,
          });
          // console.log('isExists', isExists);

          if (isExists.length === 0) {
            const creationResult = await this.createFolder(path);
            if (!creationResult) {
              return false;
            }
          }
        } catch (ex) {
          // console.log('catched exection:', ex);
          const creationResult = await this.createFolder(path);
          if (!creationResult) {
            return false;
          }
        }
      }

      return true;
    } else {
      return this.yaResources.createFolder(path);
    }
  }

  /** Used to delete a resource. */
  public async deleteResource(path: string): Promise<boolean> {
    return this.yaResources.deleteResource(path);
  }

  /** Use this method to clean trash (basket) of your yandex.disk */
  public async cleanTrash(): Promise<boolean> {
    return this.yaResources.cleanTrash();
  }

  public async deleteAllResources(): Promise<boolean> {
    const rootResources = await this.yaResources.getFolderResources('/');
    for (const resource of rootResources) {
      await this.yaResources.deleteResource(resource.path);
    }
    return true;
  }

  public async publishResource(path: string, type?: string) {
    return this.yaResources.publishResource(path, type);
  }
}
