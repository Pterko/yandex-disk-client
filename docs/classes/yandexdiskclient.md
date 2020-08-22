[yandex-disk-client](../README.md) › [Globals](../globals.md) › [YandexDiskClient](yandexdiskclient.md)

# Class: YandexDiskClient

## Hierarchy

* **YandexDiskClient**

## Index

### Constructors

* [constructor](yandexdiskclient.md#constructor)

### Methods

* [cleanTrash](yandexdiskclient.md#cleantrash)
* [createFolder](yandexdiskclient.md#createfolder)
* [deleteFile](yandexdiskclient.md#deletefile)
* [getFile](yandexdiskclient.md#getfile)
* [getFolder](yandexdiskclient.md#getfolder)
* [getQuota](yandexdiskclient.md#getquota)
* [isLoggedIn](yandexdiskclient.md#isloggedin)
* [logIn](yandexdiskclient.md#login)
* [uploadFile](yandexdiskclient.md#uploadfile)

## Constructors

###  constructor

\+ **new YandexDiskClient**(`login`: string, `password`: string, `options?`: GenericOptions): *[YandexDiskClient](yandexdiskclient.md)*

*Defined in [index.ts:23](https://github.com/Pterko/yandex-disk-client/blob/7f47f98/src/index.ts#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`login` | string |
`password` | string |
`options?` | GenericOptions |

**Returns:** *[YandexDiskClient](yandexdiskclient.md)*

## Methods

###  cleanTrash

▸ **cleanTrash**(): *Promise‹undefined | false | true›*

*Defined in [index.ts:129](https://github.com/Pterko/yandex-disk-client/blob/7f47f98/src/index.ts#L129)*

**Returns:** *Promise‹undefined | false | true›*

___

###  createFolder

▸ **createFolder**(`path`: string): *Promise‹undefined | false | true›*

*Defined in [index.ts:121](https://github.com/Pterko/yandex-disk-client/blob/7f47f98/src/index.ts#L121)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹undefined | false | true›*

___

###  deleteFile

▸ **deleteFile**(`path`: string): *Promise‹undefined | false | true›*

*Defined in [index.ts:125](https://github.com/Pterko/yandex-disk-client/blob/7f47f98/src/index.ts#L125)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹undefined | false | true›*

___

###  getFile

▸ **getFile**(`path`: string): *Promise‹any›*

*Defined in [index.ts:113](https://github.com/Pterko/yandex-disk-client/blob/7f47f98/src/index.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹any›*

___

###  getFolder

▸ **getFolder**(`path`: string): *Promise‹any›*

*Defined in [index.ts:109](https://github.com/Pterko/yandex-disk-client/blob/7f47f98/src/index.ts#L109)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹any›*

___

###  getQuota

▸ **getQuota**(): *Promise‹Quota›*

*Defined in [index.ts:104](https://github.com/Pterko/yandex-disk-client/blob/7f47f98/src/index.ts#L104)*

**Returns:** *Promise‹Quota›*

___

###  isLoggedIn

▸ **isLoggedIn**(): *boolean*

*Defined in [index.ts:92](https://github.com/Pterko/yandex-disk-client/blob/7f47f98/src/index.ts#L92)*

**Returns:** *boolean*

___

###  logIn

▸ **logIn**(): *Promise‹boolean›*

*Defined in [index.ts:56](https://github.com/Pterko/yandex-disk-client/blob/7f47f98/src/index.ts#L56)*

This method is used to perform a login into Yandex Drive.

**Returns:** *Promise‹boolean›*

boolean value that indicates successful or not successful login.

___

###  uploadFile

▸ **uploadFile**(`buffer`: Buffer, `path`: string): *Promise‹undefined | object›*

*Defined in [index.ts:117](https://github.com/Pterko/yandex-disk-client/blob/7f47f98/src/index.ts#L117)*

**Parameters:**

Name | Type |
------ | ------ |
`buffer` | Buffer |
`path` | string |

**Returns:** *Promise‹undefined | object›*
