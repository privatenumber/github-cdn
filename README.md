# 🛰 Github CDN [![GitHub stars](https://img.shields.io/github/stars/privatenumber/github-cdn.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/privatenumber/github-cdn/stargazers/)

Github CDN is [UNPKG](https://unpkg.com/) for Github — an unofficial content delivery network for every repo on Github.

Designed to provide:
- an endpoint to retrieve branches/tags/PRs of a repo
- an easy way to serve files before publishing them
- access to [npm excluded files](https://docs.npmjs.com/using-npm/developers.html#keeping-files-out-of-your-package)
- immediate (low server-caching) access to new changes pushed to Github

## 💁‍♀️ Endpoints
- `/:owner/:repo`
  - Get the default branch and all refs (branches, tags, and PRs)
  - eg. [`/vuejs/vue`](/vuejs/vue) to retrieve meta data on [vuejs/vue](https://github.com/vuejs/vue)

  <details>
  	<summary><i>Example output</i></summary>

  `json5
  {
  	"defaultBranch": "master",
  	"refs": {
  		"heads": { ... },
  		"tags": { ... },
  		"pull": { ... }
  	}
  }
  `

  </details>

- `/:owner/:repo/:ref`
  - Resolve repo ref if semver. Redirects to root of repo ref
  - eg. [`/vuejs/vue/master`](/vuejs/vue/master)
  - eg. [`/vuejs/vue/^2.0.0`](/vuejs/vue/^2.0.0)
  - eg. [`/vuejs/vue/latest`](/vuejs/vue/latest)

- `/:owner/:repo/:ref?badge`
  - Resolves the ref and pipes request to [Badgen](https://badgen.net)
  - eg. ![Latest Vue badge](/vuejs/vue/latest?badge)

- `/:owner/:repo/:ref/:path`
  - Get a file or list directory in a repo ref
  - eg. [`/vuejs/vue/v2.6.11/dist/`](/vuejs/vue/v2.6.11/dist/)
  - eg. [`/vuejs/vue/v2.6.11/dist/vue.min.js`](/vuejs/vue/v2.6.11/dist/vue.min.js)

---

Built and maintained by [@privatenumber](https://github.com/privatenumber) [![GitHub followers](https://img.shields.io/github/followers/privatenumber.svg?style=social&label=Follow)](https://github.com/privatenumber?tab=followers) and powered by [Vercel](https://vercel.com) ❤️
