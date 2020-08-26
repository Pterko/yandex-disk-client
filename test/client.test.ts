import got from 'got';

import { YandexDiskClientAuth, YandexDiskClient } from '../src';
const crypto = require('crypto');

jest.setTimeout(30000);

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

      const authClient = new YandexDiskClientAuth(login, password);
      const loginResult = await authClient.logIn();

      globalClient = authClient.getClientInstance();

      console.log('globalClient:', globalClient);

      expect(loginResult).toEqual(true);
    } else {
      throw new Error('Error while passing auth creds to test');
    }
  });

  it("random file uploads and downloads correctly (and it's not changed)", async () => {
    const randomBuf: Buffer = crypto.randomBytes(100000);
    const randomFileName = makeid(5) + '.png';

    await globalClient.uploadFile(randomBuf, randomFileName);

    const fileUrl = await globalClient.getFileDownloadUrl(randomFileName);

    const fileResponse = await got.get(fileUrl, {
      responseType: 'buffer',
    });

    const fileBuff: Buffer = fileResponse.body;

    const buffDiff = randomBuf.compare(fileBuff);

    console.log('buffDiff is', buffDiff);

    expect(buffDiff).toEqual(0);
  });

  it('uploaded file exists in resource listing', async () => {
    const randomBuf: Buffer = crypto.randomBytes(100);
    const randomFileName = makeid(5) + '.png';

    await globalClient.uploadFile(randomBuf, randomFileName);

    const resources = await globalClient.getFolderResources('/');

    const ourNewResource = resources.find(x => x.path.includes(randomFileName));

    expect(ourNewResource).toBeDefined();
    expect(ourNewResource?.id).toBeDefined();
  });
  it('duplicate file upload causes exception', async () => {
    await expect(
      (async () => {
        const randomBuf: Buffer = crypto.randomBytes(100);
        const randomFileName = makeid(5) + '.png';

        await globalClient.uploadFile(randomBuf, randomFileName);
        await globalClient.uploadFile(randomBuf, randomFileName);
      })()
    ).rejects.toThrow();
  });
  it('quota successfully returns', async () => {
    const quota = await globalClient.getQuota();

    expect(quota?.free).toBeGreaterThanOrEqual(0);
  });

  it('deleteAllResources works correctly', async () => {
    const res = await globalClient.deleteAllResources();

    await new Promise(resolve => setTimeout(resolve, 5000));

    const resources = await globalClient.getFolderResources('/');

    expect(res).toBe(true);
    expect(resources.length).toBe(0);
  });

  it('cleanTrash works correctly', async () => {
    const res = await globalClient.cleanTrash();

    await new Promise(resolve => setTimeout(resolve, 5000));

    const quota = await globalClient.getQuota();

    expect(quota?.trash).toBe(0);
    expect(res).toBe(true);
  });
});
