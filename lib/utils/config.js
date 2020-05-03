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
		token: undefined,
	};
	memcached = undefined;
	whitelist = undefined;

	constructor() {
		const { config } = cosmiconfigSync('githubcdn').search() || {};

		if (config) {
			Object.assign(this.github, config.github);
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
			}));
		}
	}

	canAccess({ owner, repo }) {
		if (!this.whitelist) { return true; }
		return this.whitelist.some(
			(whitelistItem) => whitelistItem.owner.test(owner) && whitelistItem.repo.test(repo),
		);
	}
}

module.exports = new Config();
