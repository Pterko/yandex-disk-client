const fs = require('fs');
const crypto = require('crypto');
const creds = require('./creds.json');

const YandexDiskClient = require('../dist/yandex-disk-client.cjs.development.js');

console.log(YandexDiskClient)


const wait = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));


async function start(){
  const client = new YandexDiskClient(creds.login, creds.password, {fileLogging: true});

  console.log('client', client);
  
  await client.logIn();
  
  console.log('isLoggedIn:', client.isLoggedIn());


  const quota = await client.getQuota();

  console.log('quota', quota);

  await client.getFolder('/disk');


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