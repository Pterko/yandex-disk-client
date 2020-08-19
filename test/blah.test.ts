import YandexDiskClient from '../src';

describe('blah', () => {
  it('works', () => {
    const client = new YandexDiskClient(
      process.env.TEST_LOGIN,
      process.env.TEST_PASSWORD
    );

    const loginResult = client.logIn();

    expect(loginResult).toEqual(true);
  });
});
