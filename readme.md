# 🛰 Github CDN [![GitHub stars](https://img.shields.io/github/stars/privatenumber/github-cdn.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/privatenumber/github-cdn)

Github CDN is [UNPKG](https://unpkg.com/) for Github — an unofficial content delivery network for every repo on Github.

Designed to provide:
- an endpoint to retrieve branches/tags/PRs of a repo
- an easy way to serve dev code before publishing them
- access to [npm excluded files](https://docs.npmjs.com/using-npm/developers.html#keeping-files-out-of-your-package)
- immediate (micro-cached) access to new changes pushed to Github *
- [Node API](https://github.com/privatenumber/github-cdn/blob/master/readme_node-api.md) for compatibility with Github Enterprise

_* Unless the request fails due to network failure or rate-limiting_

## 💁‍♀️ Endpoints
- `/:owner/:repo`
  - Get the default branch and all refs (branches, tags, and PRs)
  - eg. [`/vuejs/vue`](https://github-cdn.now.sh/vuejs/vue) to retrieve meta data on [vuejs/vue](https://github.com/vuejs/vue)

  <details>
  	<summary><i>Example output</i></summary>

  ```json5
  {
  	"defaultBranch": "master",
  	"refs": {
  		"heads": { ... },
  		"tags": { ... },
  		"pull": { ... }
  	}
  }
  ```

  </details>

- `/:owner/:repo/:ref`
  - Resolve repo ref if semver. Redirects to root of repo ref
  - eg. [`/vuejs/vue/master`](https://github-cdn.now.sh/vuejs/vue/master)
  - eg. [`/vuejs/vue/^2.0.0`](https://github-cdn.now.sh/vuejs/vue/^2.0.0)
  - eg. [`/vuejs/vue/latest`](https://github-cdn.now.sh/vuejs/vue/latest)

- `/:owner/:repo/:ref?badge`
  - Resolves the ref and redirects to [Badgen](https://badgen.net)
  - eg. `/vuejs/vue/latest?badge` ![Latest Vue badge](https://github-cdn.now.sh/vuejs/vue/latest?badge)

- `/:owner/:repo/:ref/:path`
  - Get a file or list directory in a repo ref
  - eg. [`/vuejs/vue/v2.6.11/dist/`](https://github-cdn.now.sh/vuejs/vue/v2.6.11/dist/)
  - eg. [`/vuejs/vue/v2.6.11/dist/vue.min.js`](https://github-cdn.now.sh/vuejs/vue/v2.6.11/dist/vue.min.js)

- `/ratelimit`
  - See the rate limit quota available on the Github API.
  - Due to this limitation, **Github CDN is not a production-ready solution** to hosting code
  - Set a custom token to use your own quota

### Setting a custom token (for rate-limiting & private repos)
You can use the token-input to attach your token to every Github CDN request via browser cookies.

<!-- insert-token-input -->

By using a custom token, you can access your private repos and use your own [rate limit quota](https://developer.github.com/v3/#rate-limiting.

---

Built and maintained by [@privatenumber](https://github.com/privatenumber) [![GitHub followers](https://img.shields.io/github/followers/privatenumber.svg?style=social&label=Follow)](https://github.com/privatenumber?tab=followers) and powered by [Vercel](https://vercel.com) ❤️