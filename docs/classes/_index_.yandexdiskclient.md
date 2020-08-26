[yandex-disk-client](../README.md) › [Globals](../globals.md) › ["index"](../modules/_index_.md) › [YandexDiskClient](_index_.yandexdiskclient.md)

# Class: YandexDiskClient

This class should be received through `getClientInstance` method of `YandexDiskClientAuth` class. **Do not use this class directly!**

## Hierarchy

* **YandexDiskClient**

## Index

### Constructors

* [constructor](_index_.yandexdiskclient.md#constructor)

### Methods

* [cleanTrash](_index_.yandexdiskclient.md#cleantrash)
* [createFolder](_index_.yandexdiskclient.md#createfolder)
* [deleteAllResources](_index_.yandexdiskclient.md#deleteallresources)
* [deleteResource](_index_.yandexdiskclient.md#deleteresource)
* [getFileDownloadUrl](_index_.yandexdiskclient.md#getfiledownloadurl)
* [getFolderResources](_index_.yandexdiskclient.md#getfolderresources)
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

Use this method to clean trash (basket) of your yandex.disk

**Returns:** *Promise‹boolean›*

___

###  createFolder

▸ **createFolder**(`path`: string): *Promise‹boolean›*

Used to create a folder. Don't support recursive creation.

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹boolean›*

___

###  deleteAllResources

▸ **deleteAllResources**(): *Promise‹boolean›*

**Returns:** *Promise‹boolean›*

___

###  deleteResource

▸ **deleteResource**(`path`: string): *Promise‹boolean›*

Used to delete a resource.

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹boolean›*

___

###  getFileDownloadUrl

▸ **getFileDownloadUrl**(`path`: string): *Promise‹string›*

Returns a https link to requested file

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹string›*

___

###  getFolderResources

▸ **getFolderResources**(`path`: string): *Promise‹[Resource](../interfaces/_interfaces_yandex_resouce_.resource.md)[]›*

  Returns an array of resources for a given folder.

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

Used to upload buffer to yandex.disk

**Parameters:**

Name | Type |
------ | ------ |
`buffer` | Buffer |
`path` | string |

**Returns:** *Promise‹object›*
