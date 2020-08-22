import got from 'got';

import YandexDiskClient from '../src';
const crypto = require('crypto');

jest.setTimeout(20000);

require('dotenv').config();

let globalClient: YandexDiskClient;

function makeid(length: number) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

describe('YandexDriveClient', () => {
  it('successfully logins', async () => {
    console.log(`Received login is ${process.env.TEST_LOGIN}`);

    if (process.env.TEST_LOGIN && process.env.TEST_PASSWORD) {
      const login: string = String(process.env.TEST_LOGIN);
      const password: string = String(process.env.TEST_PASSWORD);

      const client = new YandexDiskClient(login, password);
      const loginResult = await client.logIn();

      globalClient = client;

      expect(loginResult).toEqual(true);
    }
  });

  it("random file uploads and downloads correctly (and it's not changed)", async () => {
    const randomBuf: Buffer = crypto.randomBytes(100000);
    const randomFileName = makeid(5) + '.png';

    await globalClient.uploadFile(randomBuf, randomFileName);

    const fileUrl = await globalClient.getFile(randomFileName);

    const fileResponse = await got.get('https:' + fileUrl, {
      responseType: 'buffer',
    });

    const fileBuff: Buffer = fileResponse.body;

    const buffDiff = randomBuf.compare(fileBuff);

    console.log('buffDiff is', buffDiff);

    expect(buffDiff).toEqual(0);
  });
});
