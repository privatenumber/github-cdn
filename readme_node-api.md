# Node.js API & Github Enterprise
Github CDN offers a Node.js API so you can roll your own instance. You might want to do this to personalize it or configure it to use a Github Enterprise server.

### Install
```
$ npm i github-cdn
```

### Config
- `github`
- `memcached`
  Setting a higher storage limit is recommended: `memcached -I 10m`
- `whitelist`