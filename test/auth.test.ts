import { YandexDiskClientAuth, YandexDiskClient } from '../src';

jest.setTimeout(30000);

require('dotenv').config();

describe('YandexDriveClient', () => {

  it('fails to get client instance if not authenticated', () => {
    expect(() => {
      const authClient = new YandexDiskClientAuth('123', '123');
      authClient.getClientInstance();
    }).toThrow('Not logged in')
  })


});