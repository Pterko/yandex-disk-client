[yandex-disk-client](../README.md) › [Globals](../globals.md) › ["index"](../modules/_index_.md) › [YandexDiskClientAuth](_index_.yandexdiskclientauth.md)

# Class: YandexDiskClientAuth

## Hierarchy

* **YandexDiskClientAuth**

## Index

### Constructors

* [constructor](_index_.yandexdiskclientauth.md#constructor)

### Methods

* [getAuthObject](_index_.yandexdiskclientauth.md#getauthobject)
* [getClientInstance](_index_.yandexdiskclientauth.md#getclientinstance)
* [logIn](_index_.yandexdiskclientauth.md#login)
* [loginTroughtAuthObject](_index_.yandexdiskclientauth.md#logintroughtauthobject)

## Constructors

###  constructor

\+ **new YandexDiskClientAuth**(`login`: string, `password`: string, `internalOptions?`: GenericOptions): *[YandexDiskClientAuth](_index_.yandexdiskclientauth.md)*

**Parameters:**

Name | Type |
------ | ------ |
`login` | string |
`password` | string |
`internalOptions?` | GenericOptions |

**Returns:** *[YandexDiskClientAuth](_index_.yandexdiskclientauth.md)*

## Methods

###  getAuthObject

▸ **getAuthObject**(): *object*

**Returns:** *object*

* **cookieJar**: *any*

* **idClient**: *string*

* **skToken**: *string*

___

###  getClientInstance

▸ **getClientInstance**(): *[YandexDiskClient](_index_.yandexdiskclient.md)*

**Returns:** *[YandexDiskClient](_index_.yandexdiskclient.md)*

___

###  logIn

▸ **logIn**(): *Promise‹boolean›*

**Returns:** *Promise‹boolean›*

___

###  loginTroughtAuthObject

▸ **loginTroughtAuthObject**(`authObject`: object): *Promise‹boolean›*

**Parameters:**

▪ **authObject**: *object*

Name | Type |
------ | ------ |
`cookieJar` | any |
`idClient` | string |
`skToken` | string |

**Returns:** *Promise‹boolean›*
