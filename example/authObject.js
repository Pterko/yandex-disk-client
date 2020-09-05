const { YandexDiskClientAuth } = require('../dist/yandex-disk-client.cjs.development.js');
const creds = require('./creds.json');


async function start(){
  const authClass = new YandexDiskClientAuth(creds.login, creds.password, {fileLogging: true})

  await authClass.logIn();

  const client = authClass.getClientInstance();
  const realQuota = await client.getQuota();
  console.log('quota1:', realQuota);

  const authJSON = authClass.getAuthObject();

  console.log('authJSON', authJSON);

  const authClassFromJSON = new YandexDiskClientAuth(creds.login, creds.password, {fileLogging: true});

  await authClassFromJSON.loginTroughtAuthObject(authJSON);

  const class2 = authClassFromJSON.getClientInstance();

  const quota2 = await class2.getQuota();

  console.log('quota2', quota2);
}



start()