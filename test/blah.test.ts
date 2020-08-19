import YandexDiskClient from '../src';

describe('blah', () => {
  it('works', () => {
    let client;
    if (process.env.TEST_LOGIN && process.env.TEST_PASSWORD) {
      const login: string = String(process.env.TEST_LOGIN);
      const password: string = String(process.env.TEST_PASSWORD);

      client = new YandexDiskClient(login, password);
    }

    const loginResult = client.logIn();

    expect(loginResult).toEqual(true);
  });
});
