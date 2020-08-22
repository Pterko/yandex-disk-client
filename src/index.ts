import got, { Got } from 'got';
import { CookieJar } from 'tough-cookie';

import YaAuth from './ya/ya-auth';
import YaResources from './ya/ya-resources';
import GenericOptions from 'dto/genericOptions';

class YandexDiskClient {
  private login: string;
  private password: string;
  private phoneNumber: string | undefined;

  private skToken: string | undefined;
  private idClient: string | undefined;

  private httpClient: Got;
  private fileLogging = false;

  private auth: YaAuth;
  private yaResources?: YaResources;

  private internalOptions?: GenericOptions;

  constructor(login: string, password: string, options?: GenericOptions) {
    this.login = login;
    this.password = password;
    if (options?.phone) {
      this.phoneNumber = options?.phone;
    }

    if (options?.fileLogging) {
      this.fileLogging = options?.fileLogging;
    }

    const cookieJar = new CookieJar();
    this.httpClient = got.extend({
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
      },
      cookieJar,
    });

    this.auth = new YaAuth(this.login, this.password, this.httpClient, options);
    this.internalOptions = options;
  }

  /**
   * This method is used to perform a login into Yandex Drive.
   *
   *
   * @returns boolean value that indicates successful or not successful login.
   *
   */
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

    this.yaResources = new YaResources(
      this.httpClient,
      this.idClient,
      this.skToken
    );

    return true;
  }

  public isLoggedIn(){
    return !!(this.yaResources && this.skToken);
  }

  public async getFolder(path: string) {
    return this.yaResources?.getFolderInfo(path);
  }

  public async getFile(path: string) {
    return this.yaResources?.getFileUrl(path);
  }

  public async uploadFile(buffer: Buffer, path: string) {
    return this.yaResources?.uploadFile(path, buffer);
  }

  public async createFolder(path: string) {
    return this.yaResources?.createFolder(path);
  }

  public async deleteFile(path: string) {
    return this.yaResources?.deleteFile(path);
  }

  public async cleanTrash() {
    return this.yaResources?.cleanTrash();
  }
}


export default YandexDiskClient;
module.exports = YandexDiskClient;
