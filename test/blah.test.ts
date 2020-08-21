import YandexDiskClient from '../src';
require('dotenv').config();

console.log(`Received login is ${process.env.TEST_LOGIN}`);

describe('blah', () => {
  it('works', async () => {
    console.log(`Received login is ${process.env.TEST_LOGIN}`);

    if (process.env.TEST_LOGIN && process.env.TEST_PASSWORD) {
      const login: string = String(process.env.TEST_LOGIN);
      const password: string = String(process.env.TEST_PASSWORD);

      const client = new YandexDiskClient(login, password);
      const loginResult = await client.logIn();

      expect(loginResult).toEqual(true);
    }
  });
});
