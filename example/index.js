const crypto = require('crypto');
const creds = require('./creds.json');

const { YandexDiskClientAuth } = require('../dist/yandex-disk-client.cjs.development.js');

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const wait = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));


async function start(){
  const authClass = new YandexDiskClientAuth(creds.login, creds.password, {fileLogging: true})

  await authClass.logIn();

  const client = authClass.getClientInstance();

  // const resources = await client.getFolderResources('/eqwewqewqewqewqewqeqwqwddwqdwqdwqdqw');
  // console.log('res', resources);

  // const quota = await client.getQuota();

  // console.log('quota', quota);


  await client.createFolder('/chipi11/store/123/data', {isRecursive: true});

  // await client.createFolder('/chipi11');

  // const clean = await client.deleteAllResources();

  // const randomBuf = crypto.randomBytes(100000);
  // const randomFileName = makeid(5) + '.png';

  // const result = await client.uploadFile(randomBuf, '123/123/123/123/111.png');

  // console.log('result');
  // console.log(result);


  setTimeout(() => {}, 10000000);
  


  // const client = new YandexDiskClient(creds.login, creds.password, {fileLogging: false});

  // console.log('client', client);
  
  // await client.logIn();
  
  // // console.log('isLoggedIn:', client.isLoggedIn());


  // const quota = await client.getQuota();

  // console.log('quota', quota);

  // await client.getFolder('/disk');


  // await client.deleteFile('1111')


  // await client.createFolder('/chipi11/store/123/data');

  // await client.getFile('123.png');

  // const fileBuf = fs.readFileSync('../test/test.png');

  // const randomBuf = crypto.randomBytes(100000);

  // await client.uploadFile(randomBuf, 'qweqwe.png');


  // console.log('wait some time');
  // await wait(10000);

  // await client.deleteFile('qweqwe.png')

  // console.log('wait some time');
  // await wait(10000);

  // await client.cleanTrash();

}

start();