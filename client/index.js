const fs = require('fs');
const crypto = require('crypto');
const creds = require('./creds.json');

const YandexDiskClient = require('../dist/yandex-disk-client.cjs.development.js');

console.log(YandexDiskClient)



async function start(){
  const client = new YandexDiskClient(creds.login, creds.password, {fileLogging: true});

  console.log('client', client);
  
  await client.logIn();
  
  await client.getFolder('/disk');


  await client.createFolder('/chipi11/store/123/data');

  // await client.getFile('123.png');

  // const fileBuf = fs.readFileSync('../test/test.png');

  // const randomBuf = crypto.randomBytes(100000);

  // await client.uploadFile(randomBuf, '123/qwe.png');
}

start();