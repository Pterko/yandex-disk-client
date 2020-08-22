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
* [isLoggedIn](yandexdiskclient.md#isloggedin)
* [logIn](yandexdiskclient.md#login)
* [uploadFile](yandexdiskclient.md#uploadfile)

## Constructors

###  constructor

\+ **new YandexDiskClient**(`login`: string, `password`: string, `options?`: GenericOptions): *[YandexDiskClient](yandexdiskclient.md)*

*Defined in [index.ts:22](https://github.com/Pterko/yandex-disk-client/blob/2c38565/src/index.ts#L22)*

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

*Defined in [index.ts:115](https://github.com/Pterko/yandex-disk-client/blob/2c38565/src/index.ts#L115)*

**Returns:** *Promise‹undefined | false | true›*

___

###  createFolder

▸ **createFolder**(`path`: string): *Promise‹undefined | false | true›*

*Defined in [index.ts:107](https://github.com/Pterko/yandex-disk-client/blob/2c38565/src/index.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹undefined | false | true›*

___

###  deleteFile

▸ **deleteFile**(`path`: string): *Promise‹undefined | false | true›*

*Defined in [index.ts:111](https://github.com/Pterko/yandex-disk-client/blob/2c38565/src/index.ts#L111)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹undefined | false | true›*

___

###  getFile

▸ **getFile**(`path`: string): *Promise‹any›*

*Defined in [index.ts:99](https://github.com/Pterko/yandex-disk-client/blob/2c38565/src/index.ts#L99)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹any›*

___

###  getFolder

▸ **getFolder**(`path`: string): *Promise‹any›*

*Defined in [index.ts:95](https://github.com/Pterko/yandex-disk-client/blob/2c38565/src/index.ts#L95)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹any›*

___

###  isLoggedIn

▸ **isLoggedIn**(): *boolean*

*Defined in [index.ts:91](https://github.com/Pterko/yandex-disk-client/blob/2c38565/src/index.ts#L91)*

**Returns:** *boolean*

___

###  logIn

▸ **logIn**(): *Promise‹boolean›*

*Defined in [index.ts:55](https://github.com/Pterko/yandex-disk-client/blob/2c38565/src/index.ts#L55)*

This method is used to perform a login into Yandex Drive.

**Returns:** *Promise‹boolean›*

boolean value that indicates successful or not successful login.

___

###  uploadFile

▸ **uploadFile**(`buffer`: Buffer, `path`: string): *Promise‹undefined | object›*

*Defined in [index.ts:103](https://github.com/Pterko/yandex-disk-client/blob/2c38565/src/index.ts#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`buffer` | Buffer |
`path` | string |

**Returns:** *Promise‹undefined | object›*
