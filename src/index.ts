import got, { Got } from 'got';
import { CookieJar } from 'tough-cookie';

import YaAuth from './ya-auth';
import YaOperations from './ya-operations';

class YandexDiskClient {
  public login: string;
  public password: string;
  public phoneNumber: string | undefined;

  public skToken: string | undefined;
  public idClient: string | undefined;

  public httpClient: Got;
  public fileLogging = false;

  private auth: YaAuth;

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

    return true;
  }

  public async getFolder(path: string) {
    return YaOperations.getFolderInfo(this, path);
  }

  public async getFile(path: string) {
    return YaOperations.getFileUrl(this, path);
  }

  public async uploadFile(buffer: Buffer, path: string) {
    return YaOperations.uploadFile(this, path, buffer);
  }

  public async createFolder(path: string) {
    return YaOperations.createFolder(this, path);
  }

  public async deleteFile(path: string) {
    return YaOperations.deleteFile(this, path);
  }

  public async cleanTrash() {
    return YaOperations.cleanTrash(this);
  }
}

export default YandexDiskClient;
module.exports = YandexDiskClient;
