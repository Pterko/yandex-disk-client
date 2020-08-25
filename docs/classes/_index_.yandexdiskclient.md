[yandex-disk-client](../README.md) › [Globals](../globals.md) › ["index"](../modules/_index_.md) › [YandexDiskClient](_index_.yandexdiskclient.md)

# Class: YandexDiskClient

## Hierarchy

* **YandexDiskClient**

## Index

### Constructors

* [constructor](_index_.yandexdiskclient.md#constructor)

### Methods

* [cleanTrash](_index_.yandexdiskclient.md#cleantrash)
* [createFolder](_index_.yandexdiskclient.md#createfolder)
* [deleteFile](_index_.yandexdiskclient.md#deletefile)
* [getFileDownloadUrl](_index_.yandexdiskclient.md#getfiledownloadurl)
* [getFolder](_index_.yandexdiskclient.md#getfolder)
* [getQuota](_index_.yandexdiskclient.md#getquota)
* [uploadFile](_index_.yandexdiskclient.md#uploadfile)

## Constructors

###  constructor

\+ **new YandexDiskClient**(`httpClient`: Got, `skToken`: string, `idClient`: string, `internalOptions?`: GenericOptions): *[YandexDiskClient](_index_.yandexdiskclient.md)*

**Parameters:**

Name | Type |
------ | ------ |
`httpClient` | Got |
`skToken` | string |
`idClient` | string |
`internalOptions?` | GenericOptions |

**Returns:** *[YandexDiskClient](_index_.yandexdiskclient.md)*

## Methods

###  cleanTrash

▸ **cleanTrash**(): *Promise‹boolean›*

**Returns:** *Promise‹boolean›*

___

###  createFolder

▸ **createFolder**(`path`: string): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹boolean›*

___

###  deleteFile

▸ **deleteFile**(`path`: string): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹boolean›*

___

###  getFileDownloadUrl

▸ **getFileDownloadUrl**(`path`: string): *Promise‹string›*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹string›*

___

###  getFolder

▸ **getFolder**(`path`: string): *Promise‹[Resource](../interfaces/_interfaces_yandex_resouce_.resource.md)[]›*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹[Resource](../interfaces/_interfaces_yandex_resouce_.resource.md)[]›*

___

###  getQuota

▸ **getQuota**(): *Promise‹[Quota](../interfaces/_interfaces_yandex_quota_.quota.md)›*

**Returns:** *Promise‹[Quota](../interfaces/_interfaces_yandex_quota_.quota.md)›*

___

###  uploadFile

▸ **uploadFile**(`buffer`: Buffer, `path`: string): *Promise‹object›*

**Parameters:**

Name | Type |
------ | ------ |
`buffer` | Buffer |
`path` | string |

**Returns:** *Promise‹object›*
