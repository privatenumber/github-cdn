const assert = require('assert');
const { cosmiconfigSync } = require('cosmiconfig');
const escapeRegExp = require('lodash/escapeRegExp');

const str2regexp = str => new RegExp('^' + escapeRegExp(str) + '$');

const { config } = cosmiconfigSync('githubcdn').search() || {};

if (config && config.whitelist) {
	config.whitelist.forEach((item, idx) => {
		assert(item.owner, `"owner" not found on whitelist[${idx}]. "owner" must be set on all whitelist items.`);
	});

	config.whitelist = config.whitelist.map((item) => ({
		owner: str2regexp(item.owner),
		repo: item.repo ? str2regexp(item.repo) : /.+/,
	}));
}

function canAccess({ owner, repo }) {
	if (!config || !config.whitelist) { return true; }
	return config.whitelist.some(
		(whitelistItem) => whitelistItem.owner.test(owner) && whitelistItem.repo.test(repo)
	);
};


const GITHUB_PUBLIC = 'https://github.com';
const GITHUB_PUBLIC_API = 'https://api.github.com';

const {
	GITHUB_HOST = GITHUB_PUBLIC,
	GITHUB_API_BASE = GITHUB_HOST === GITHUB_PUBLIC ? GITHUB_PUBLIC_API : new Error('a'),
	GITHUB_TOKEN,
} = process.env;




module.exports = {
	canAccess,
	GITHUB_HOST,
	GITHUB_API_BASE,
	GITHUB_TOKEN,
};
