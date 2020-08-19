import crypto from 'crypto';
import md5 from 'md5';
import YandexDiskClient from './index';

// TODO: implement deleting of ending slash
const mergePath = (path: string) => {
  if (path.startsWith('/')) {
    return '/disk' + path;
  } else {
    return '/disk/' + path;
  }
};

export default {
  async getFolderInfo(client: YandexDiskClient, path: string) {
    console.log('getFolderInfo');

    const result = await client.httpClient.post(
      'https://disk.yandex.ru/models/?_m=resources',
      {
        form: {
          idClient: client.idClient,
          sk: client.skToken,
          '_model.0': 'resources',
          'sort.0': 'size',
          'order.0': 1,
          'idContext.0': mergePath(path),
          'amount.0': 40,
          'offset.0': 0,
          'withParent.0': 1,
        },
      }
    );

    console.log(result.body);

    return result.body;
  },

  async getFileUrl(client: YandexDiskClient, path: string) {
    console.log('getFileUrl');

    const result = await client.httpClient.post(
      'https://disk.yandex.ru/models/?_m=do-get-resource-url',
      {
        form: {
          idClient: client.idClient,
          sk: client.skToken,
          '_model.0': 'do-get-resource-url',
          'id.0': mergePath(path),
        },
        responseType: 'json',
      }
    );

    const resultBody: any = result.body;

    console.log(result.body);

    if (resultBody.models[0].data.file) {
      return resultBody.models[0].data.file;
    }

    throw new Error('File link not found');
  },

  async uploadFile(client: YandexDiskClient, path: string, buffer: Buffer) {
    console.log('uploadFile');

    const calcMd5 = md5(buffer);

    console.log('md5', calcMd5);

    const calcSHA256 = crypto
      .createHash('sha256')
      .update(buffer)
      .digest('hex');

    console.log('sha256', calcSHA256);

    const result = await client.httpClient.post(
      'https://disk.yandex.ru/models/?_m=do-get-resource-url',
      {
        form: {
          idClient: client.idClient,
          sk: client.skToken,
          '_model.0': 'do-resource-upload-url',
          'dst.0': mergePath(path),
          'force.0': 0,
          'size.0': buffer.byteLength,
          'md5.0': calcMd5,
          'sha256.0': calcSHA256,
        },
        responseType: 'json',
      }
    );

    console.log('first upload answer', result.body);

    const resultBody: any = result.body;

    // check status of upload //
    const uploadStatus = resultBody?.models[0]?.data?.status;

    if (uploadStatus === 'hardlinked') {
      console.log('Successful upload, this file was found on server');
      return { success: true };
    }

    console.log('file wasnt presented on server, uploading it...');
    const uploadData = resultBody?.models[0];

    console.log('uploadData:', uploadData);

    if (uploadData?.data?.error) {
      console.log('error body:', uploadData.data.error.body);
      throw new Error(
        'Failed to upload file:' + JSON.stringify(uploadData.data.error)
      );
    }

    if (uploadData?.data?.upload_url) {
      const operationId = uploadData.data.oid;

      // upload file to url
      const putResult = await client.httpClient.put(
        uploadData?.data?.upload_url,
        {
          headers: {
            Referer:
              'https://disk.yandex.ru/client/disk?source=landing2_signin_ru',
            // 'X-Disk-Uploader-Wait-Complete-Upload': false
          },
          body: buffer,
        }
      );

      console.log('put:', putResult.statusCode);

      const verifyResult = await client.httpClient.post(
        'https://disk.yandex.ru/models/?_m=do-status-operation',
        {
          headers: {
            Referer:
              'https://disk.yandex.ru/client/disk?source=landing2_signin_ru',
            // 'X-Disk-Uploader-Wait-Complete-Upload': false
          },
          form: {
            idClient: client.idClient,
            sk: client.skToken,
            '_model.0': 'do-status-operation',
            'oid.0': operationId,
          },
        }
      );

      console.log('verifyResult', verifyResult.body);
    }

    return { success: true };
  },

  async createFolder(client: YandexDiskClient, path: string) {
    console.log('createFolder');

    const createFolderResult = await client.httpClient.post(
      'https://disk.yandex.ru/models/?_m=do-resource-create-folder',
      {
        headers: {
          Referer:
            'https://disk.yandex.ru/client/disk?source=landing2_signin_ru',
          // 'X-Disk-Uploader-Wait-Complete-Upload': false
        },
        form: {
          idClient: client.idClient,
          sk: client.skToken,
          '_model.0': 'do-resource-create-folder',
          'id.0': mergePath(path),
          'force.0': 1,
        },
      }
    );

    console.log(createFolderResult.body);

    return true;
  },
};
