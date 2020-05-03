# Node.js API & Github Enterprise
Github CDN offers a Node.js API so you can roll your own instance. You might want to do this to personalize it or configure it to use a Github Enterprise server.

## 🚀 Quick setup
### Install
```
$ npm i github-cdn
```

### Add to Express
```js
import express from 'express';
import cookieParser from 'cookie-parser';
import githubCdnRouter from 'github-cdn';

const app = express();

...

// For parsing the custom token
app.use(cookieParser());

app.use(githubCdnRouter);

...

app.listen(...);

```

## Config
Github CDN points at the [public Github](https://github.com) by default, but you can configure it to point to a Github Enterprise, use memcached, or add a whitelist.

The configuration file is detected and read using [cosmicconfig](https://github.com/davidtheclark/cosmiconfig) to support various config naming conventions (eg. `.githubcdnrc.js`, `githubcdn.config.js`).

### Schema
- `github` (`Object`)
  - `base` (`String`) - Github URL (default: `https://github.com`)
  - `apiBase` (`String`) - Github API URL (default: `https://api.github.com`)
  - `token` (`String`) - Github API token

- `memcached` (`String`) - Memcached `host:port` (eg. `localhost:11211`)
   _Tip: Set a higher storage limit via `memcached -I 10m`_

- `whitelist` (`Array<Object>`) - Only allow access to specific repos
  - `owner` (`String`) - Owner of the repo to whitelist
  - `repo` (`String`) - Name of the repo to whitelist
