import got, { Got } from 'got';

import YaAuth from './ya-auth';
import YaOperations from './ya-operations';

const { CookieJar } = require('tough-cookie');

class YandexDiskClient {
  public login: string;
  public password: string;
  public phoneNumber: string | undefined;

  public skToken: string | undefined;
  public idClient: string | undefined;

  public httpClient: Got;

  constructor(login: string, password: string, options?: { phone: string }) {
    this.login = login;
    this.password = password;
    if (options?.phone) {
      this.phoneNumber = options?.phone;
    }

    const cookieJar = new CookieJar();
    this.httpClient = got.extend({
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
      },
      cookieJar,
    });
  }

  async logIn() {
    console.log(
      `Logging in using login ${this.login}, password ${this.password} and phone ${this.phoneNumber}`
    );

    const preauthResult = await YaAuth.YadPreAuthRequest(this);
    console.log('preauth result: ', preauthResult);

    const loginRequest = await YaAuth.YadAuthLoginRequest(
      this,
      preauthResult.csrf,
      preauthResult.uuid
    );

    const passwordRequest = await YaAuth.YadAuthPasswordRequest(
      this,
      preauthResult.csrf,
      loginRequest.track_id
    );

    const accountsRequest = await YaAuth.YadAuthAccountsRequest(
      this,
      preauthResult.csrf
    );

    const diskSkResult = await YaAuth.YadAuthDiskSkRequest(this);

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
}

export default YandexDiskClient;
module.exports = YandexDiskClient;
