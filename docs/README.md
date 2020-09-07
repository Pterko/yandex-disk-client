[yandex-disk-client](README.md) › [Globals](globals.md)

# yandex-disk-client

# Yandex Disk Client 
![Snyk Vulnerabilities for npm package version](https://img.shields.io/snyk/vulnerabilities/npm/yandex-disk-client?style=for-the-badge)    ![npm](https://img.shields.io/npm/dm/yandex-disk-client?style=for-the-badge)       ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/yandex-disk-client?style=for-the-badge)     ![](https://img.shields.io/npm/v/yandex-disk-client?style=for-the-badge)  ![Codecov](https://img.shields.io/codecov/c/github/pterko/yandex-disk-client?style=for-the-badge)

[Docs](https://github.com/Pterko/yandex-disk-client/blob/master/docs/modules/_index_.md)

This is Node.js client for the Yandex Disk service. It's designed to work only in node.js environment and supports only login-password auth.

Currently, this module is under active development, so feel free to fill an issue if you need some feature or you're experiencing some problem.

This module supports all common operations with cloud storage (create a folder, upload a file, download a file, remove a file, etc...);

A simple example of how to use this module: 
```javascript
const { YandexDiskClientAuth } = require('yandex-disk-client');

const authClass = new YandexDiskClientAuth(creds.login, creds.password);

await authClass.logIn();
const client = authClass.getClientInstance();

// To get resources
const resources = await client.getFolderResources('/');

// To get available quota
const quota = await client.getQuota();

```
