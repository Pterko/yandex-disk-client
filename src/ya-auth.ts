import YandexDiskClient from './index';
var FormData = require('form-data');

import fs from 'fs';

// INSPIRED BY yar229's CODE
// https://github.com/yar229/WebDavMailRuCloud
// https://github.com/yar229/WebDavMailRuCloud/blob/master/MailRuCloud/MailRuCloudApi/Base/Repos/YandexDisk/YadWeb/Requests/



export default {
  async YadPreAuthRequest(client: YandexDiskClient) {
    console.log('preauth');

    const result = await client.httpClient.get('https://passport.yandex.ru/auth');

    fs.writeFileSync('../logs/preauth.html', result.body);

    const csrfRegexMatch = /data-csrf="(?<csrf>.*?)"/gm.exec(result.body);

    const processUUIDMatch = /process_uuid=(?<uuid>\S+?)"/gm.exec(result.body);

    if (csrfRegexMatch?.groups?.csrf && processUUIDMatch?.groups?.uuid){
      return {csrf: csrfRegexMatch?.groups?.csrf, uuid: processUUIDMatch?.groups?.uuid}
    } else {
      throw new Error('Error while parsing preauth data');
    }
  },

  async YadAuthLoginRequest(client: YandexDiskClient, csrf: string, uuid: string){
    console.log('YadAuthLoginRequest');

    const result = await client.httpClient.post('https://passport.yandex.ru/registration-validations/auth/multi_step/start', {

      headers: {
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Referer: 'https://passport.yandex.ru/auth/list?from=cloud&origin=disk_landing_web_signin_ru&retpath=https%3A%2F%2Fdisk.yandex.ru%2Fclient%2Fdisk&backpath=https%3A%2F%2Fdisk.yandex.ru&mode=edit'
      },
      form: {
        csrf_token: csrf,
        process_uuid: uuid,
        login: client.login,
        service: 'cloud',
        retpath: 'https://disk.yandex.ru?source=landing2_signin_ru',
        origin: 'disk_landing2_signin_ru'
      },
      // throwHttpErrors: false
    });

    fs.writeFileSync('../logs/YadAuthLoginRequest.html', result.body);

    console.log(result.body);

    return JSON.parse(result.body);

  },

  async YadAuthPasswordRequest(client: YandexDiskClient, csrf: string, trackId: string){
    console.log('YadAuthPasswordRequest');

    const result = await client.httpClient.post('https://passport.yandex.ru/registration-validations/auth/multi_step/commit_password', {
      body: `csrf_token=${csrf}&track_id=${trackId}&password=${encodeURIComponent(client.password)}`,
      // throwHttpErrors: false
    });

    fs.writeFileSync('../logs/YadAuthPasswordRequest.html', result.body);

    console.log(result.body);

    return JSON.parse(result.body);
  },

  async YadAuthAccountsRequest(client: YandexDiskClient, csrf: string){
    console.log('YadAuthAccountsRequest');

    const result = await client.httpClient.post('https://passport.yandex.ru/registration-validations/auth/accounts', {
      body: `csrf_token=${csrf}`,
      // throwHttpErrors: false
    });

    fs.writeFileSync('../logs/YadAuthAccountsRequest.html', result.body);

    console.log(result.body);

    return JSON.parse(result.body);
  },

  async YadAuthDiskSkRequest(client: YandexDiskClient){
    console.log('YadAuthDiskSkRequest');

    const result = await client.httpClient.post('https://disk.yandex.ru/client/disk', {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-User': '?1',
        'Referer': 'https://passport.yandex.ru/auth/list?from=cloud&origin=disk_landing_web_signin_ru&retpath=https%3A%2F%2Fdisk.yandex.ru%2Fclient%2Fdisk&backpath=https%3A%2F%2Fdisk.yandex.ru&mode=edit'
      }
    });

    fs.writeFileSync('../logs/YadAuthDiskSkRequest.html', result.body);

    // console.log(result.body);

    const skTokenMatch = /"sk":"(?<sk>.+?)"/gm.exec(result.body);

    const clientIdMatch = /"idClient":"(?<idClient>.+?)"/gm.exec(result.body);


    if (skTokenMatch?.groups?.sk && clientIdMatch?.groups?.idClient){
      return { skToken: skTokenMatch?.groups?.sk, idClient: clientIdMatch?.groups?.idClient }
    }

    throw new Error('Error while parsing SK token');
    // return JSON.parse(result.body);
  }
}

