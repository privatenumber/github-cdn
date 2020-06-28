const assert = require('assert');
const { cosmiconfigSync } = require('cosmiconfig');
const escapeRegExp = require('lodash/escapeRegExp');

const GITHUB_PUBLIC = 'https://github.com';
const GITHUB_PUBLIC_API = 'https://api.github.com';

const str2regexp = (str) => new RegExp(`^${escapeRegExp(str)}$`);

class Config {
	github = {
		base: GITHUB_PUBLIC,
		apiBase: undefined,
		token: process.env.GITHUB_TOKEN,
	};

	// Absolute incase instance configured for enterprise; empty token to reset readme fetch auth
	landingPageMdSrc = 'https://github-cdn.now.sh/privatenumber/github-cdn/master/readme.md?token';

	memcached = undefined;

	whitelist = undefined;

	constructor() {
		const { config } = cosmiconfigSync('githubcdn').search() || {};

		if (config) {
			if (config.github) {
				Object.assign(this.github, config.github);
			}

			if (config.landingPageMdSrc) {
				this.landingPageMdSrc = config.landingPageMdSrc;
			}

			this.memcached = config.memcached;
			this.whitelist = config.whitelist;
		}

		this.validateConfig();
	}

	validateConfig() {
		if (this.github.base === GITHUB_PUBLIC) {
			this.github.apiBase = GITHUB_PUBLIC_API;
		} else if (!this.github.apiBase) {
			throw new Error('"github.apiBase" must be set');
		}

		if (this.whitelist) {
			this.whitelist.forEach((item, idx) => {
				assert(item.owner, `"owner" not found on whitelist[${idx}]. "owner" must be set on all whitelist items.`);
			});

			this.whitelist = this.whitelist.map((item) => ({
				owner: str2regexp(item.owner),
				repo: item.repo ? str2regexp(item.repo) : /.+/,
				gists: item.gists,
			}));
		}
	}

	canAccess({ owner, repo, gists }) {
		if (!this.whitelist) { return true; }
		return this.whitelist.some(
			(whitelistItem) => (
				whitelistItem.owner.test(owner)
				&& whitelistItem.repo.test(repo)
				&& (!gists || (gists && whitelistItem.gists))
			),
		);
	}
}

module.exports = new Config();
