import got, { Got } from 'got';
import { CookieJar } from 'tough-cookie';

import YaAuth from './ya/ya-auth';
import YaResources from './ya/ya-resources';
import GenericOptions from 'interfaces/genericOptions';
import Quota from 'interfaces/yandex/Quota';
import Resource from 'interfaces/yandex/Resouce';


export class YandexDiskClientAuth {
  private login: string;
  private password: string;
  private httpClient: Got;
  private auth: YaAuth;

  private skToken: string | undefined;
  private idClient: string | undefined;

  private internalOptions?: GenericOptions;

  constructor(
    login: string,
    password: string,
    internalOptions?: GenericOptions
  ) {
    this.login = login;
    this.password = password;

    const cookieJar = new CookieJar();
    this.httpClient = got.extend({
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
      },
      cookieJar,
    });

    this.auth = new YaAuth(
      this.login,
      this.password,
      this.httpClient,
      internalOptions
    );
    this.internalOptions = internalOptions;
  }

  async logIn(): Promise<boolean> {
    console.log(`Logging in using login ${this.login}`);

    const preauthResult = await this.auth.YadPreAuthRequest();
    console.log('preauth result: ', preauthResult);

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

    console.log('diskSkResult', diskSkResult);

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
}

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

  public async getFolder(path: string): Promise<Resource[]> {
    return this.yaResources.getFolderResources(path);
  }

  public async getFileDownloadUrl(path: string): Promise<string> {
    return this.yaResources.getFileDownloadUrl(path);
  }

  public async uploadFile(
    buffer: Buffer,
    path: string
  ): Promise<{ status: string; resource?: Resource }> {
    return this.yaResources.uploadFile(path, buffer);
  }

  public async createFolder(path: string): Promise<boolean> {
    return this.yaResources.createFolder(path);
  }

  public async deleteFile(path: string): Promise<boolean> {
    return this.yaResources.deleteFile(path);
  }

  public async cleanTrash(): Promise<boolean> {
    return this.yaResources.cleanTrash();
  }
}
