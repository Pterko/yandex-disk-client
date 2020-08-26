import crypto from 'crypto';
import md5 from 'md5';

import { mergePath, wait } from '../utils';
import { Got } from 'got/dist/source';
import GenericOptions from 'interfaces/genericOptions';
import Resource from 'interfaces/yandex/Resouce';
import Quota from 'interfaces/yandex/Quota';

class YaResourses {
  private httpClient: Got;
  private idClient: string;
  private skToken: string;

  constructor(
    httpClient: Got,
    idClient: string,
    skToken: string,
    internalOptions?: GenericOptions
  ) {
    this.httpClient = httpClient;
    this.idClient = idClient;
    this.skToken = skToken;
  }

  async getFolderResources(
    path: string,
    { withParent = false }: { withParent?: boolean } = {}
  ): Promise<Resource[]> {
    console.log('getFolderInfo');
    console.log('withParent', withParent);

    const result: any = await this.httpClient.post(
      'https://disk.yandex.ru/models/?_m=resources',
      {
        form: {
          idClient: this.idClient,
          sk: this.skToken,
          '_model.0': 'resources',
          'sort.0': 'size',
          'order.0': 1,
          'idContext.0': mergePath(path),
          'amount.0': 100,
          'offset.0': 0,
          'withParent.0': withParent ? 1 : 0,
        },
        responseType: 'json',
      }
    );

    console.log(result.body);

    // sometimes yandex ignores our `withParent` and still passes parent directory
    if (!withParent) {
      // console.log('resources before filter', result.body?.models[0]?.data?.resources)
      return (
        result.body?.models[0]?.data?.resources.filter((x: any) => {
          return x.path !== mergePath(path) && x.id !== mergePath(path);
        }) || []
      );
    }

    return result.body?.models[0]?.data?.resources || [];
  }

  async getFileDownloadUrl(path: string) {
    console.log('getFileDownloadUrl');

    const result = await this.httpClient.post(
      'https://disk.yandex.ru/models/?_m=do-get-resource-url',
      {
        form: {
          idClient: this.idClient,
          sk: this.skToken,
          '_model.0': 'do-get-resource-url',
          'id.0': mergePath(path),
        },
        responseType: 'json',
      }
    );

    const resultBody: any = result.body;

    console.log(result.body);

    if (resultBody?.models[0]?.data?.file) {
      return `https:${resultBody.models[0].data.file}`;
    }

    throw new Error('File link not found');
  }

  async uploadFile(
    path: string,
    buffer: Buffer
  ): Promise<{ status: string; error?: any; resource?: Resource }> {
    console.log('uploadFile');

    const calcMd5 = md5(buffer);

    console.log('md5', calcMd5);

    const calcSHA256 = crypto
      .createHash('sha256')
      .update(buffer)
      .digest('hex');

    console.log('sha256', calcSHA256);

    const result = await this.httpClient.post(
      'https://disk.yandex.ru/models/?_m=do-get-resource-url',
      {
        form: {
          idClient: this.idClient,
          sk: this.skToken,
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
      return { status: 'hardlinked' };
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
      const putResult = await this.httpClient.put(
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

      const verifyResult = await this.httpClient.post(
        'https://disk.yandex.ru/models/?_m=do-status-operation',
        {
          headers: {
            Referer:
              'https://disk.yandex.ru/client/disk?source=landing2_signin_ru',
            // 'X-Disk-Uploader-Wait-Complete-Upload': false
          },
          form: {
            idClient: this.idClient,
            sk: this.skToken,
            '_model.0': 'do-status-operation',
            'oid.0': operationId,
          },
          responseType: 'json',
        }
      );

      const verJson: any = verifyResult.body;

      return { status: 'stored', resource: verJson?.models[0]?.data?.resource };
    }

    throw new Error('Error while uploading: strange state!');
  }

  async createFolder(path: string): Promise<boolean> {
    console.log('createFolder');

    const createFolderResult = await this.httpClient.post(
      'https://disk.yandex.ru/models/?_m=do-resource-create-folder',
      {
        headers: {
          Referer:
            'https://disk.yandex.ru/client/disk?source=landing2_signin_ru',
          // 'X-Disk-Uploader-Wait-Complete-Upload': false
        },
        form: {
          idClient: this.idClient,
          sk: this.skToken,
          '_model.0': 'do-resource-create-folder',
          'id.0': mergePath(path),
          'force.0': 1,
        },
        responseType: 'json',
      }
    );

    console.log(createFolderResult.body);

    return true;
  }

  async deleteResource(path: string) {
    console.log('deleteFile');

    const deleteFileResult = await this.httpClient.post(
      'https://disk.yandex.ru/models/?_m=do-resource-delete',
      {
        headers: {
          Referer:
            'https://disk.yandex.ru/client/disk?source=landing2_signin_ru',
        },
        form: {
          idClient: this.idClient,
          sk: this.skToken,
          '_model.0': 'do-resource-delete',
          'id.0': mergePath(path),
          'force.0': 1,
        },
      }
    );

    console.log(deleteFileResult.body);

    return true;
  }

  async cleanTrash() {
    console.log('cleanTrash');

    const deleteFileResult: any = await this.httpClient.post(
      'https://disk.yandex.ru/models/?_m=do-clean-trash',
      {
        headers: {
          Referer: 'https://disk.yandex.ru/client/trash',
        },
        form: {
          idClient: this.idClient,
          sk: this.skToken,
          '_model.0': 'do-clean-trash',
        },
        responseType: 'json',
      }
    );

    console.log(deleteFileResult.body);

    const operationId = deleteFileResult?.body?.models[0]?.data?.oid;

    if (operationId) {
      const getOperationStatus = async (
        httpClient: Got,
        operationId: string
      ) => {
        const operationResult: any = await httpClient.post(
          'https://disk.yandex.ru/models/?_m=do-status-operation',
          {
            headers: {
              Referer: 'https://disk.yandex.ru/client/trash',
            },
            form: {
              idClient: this.idClient,
              sk: this.skToken,
              '_model.0': 'do-status-operation',
              'oid.0': operationId,
            },
            responseType: 'json',
          }
        );

        return operationResult.body;
      };

      let currentOperationResult = await getOperationStatus(
        this.httpClient,
        operationId
      );

      let currentOperationStatus =
        currentOperationResult?.models[0]?.data?.status;

      if (!currentOperationStatus) {
        console.log('Error happened:', currentOperationResult);
        return false;
      }

      console.log('Current status: ', currentOperationStatus);

      while (['EXECUTING', 'WAITING'].includes(currentOperationStatus)) {
        await wait(1000);

        currentOperationResult = await getOperationStatus(
          this.httpClient,
          operationId
        );

        currentOperationStatus =
          currentOperationResult?.models[0]?.data?.status;

        console.log('Current status: ', currentOperationStatus);

        if (!currentOperationStatus) {
          console.log('Error happened:', currentOperationResult);
          return false;
        }
      }

      return true;
    } else {
      console.log('Error happened: ', deleteFileResult);
      return false;
    }
  }

  public async getQuota(): Promise<Quota> {
    console.log('getQuota');

    const result = await this.httpClient.post(
      'https://disk.yandex.ru/models/?_m=space',
      {
        form: {
          idClient: this.idClient,
          sk: this.skToken,
          '_model.0': 'space',
          'locale.0': 'ru',
        },
        responseType: 'json',
      }
    );

    const resultBody: any = result.body;

    console.log(result.body);

    if (resultBody?.models[0]?.data) {
      return resultBody?.models[0]?.data;
    }

    throw new Error('File link not found');
  }
}

export default YaResourses;
