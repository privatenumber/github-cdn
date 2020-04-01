import assert from 'assert';
import { cosmiconfigSync } from 'cosmiconfig';
import escapeRegExp from 'lodash/escapeRegExp';

const str2regexp = str => new RegExp('^' + escapeRegExp(str) + '$');

const { config } = cosmiconfigSync('githubcdn').search() || {};

if (config.whitelist) {
	config.whitelist.forEach((item, idx) => {
		assert(item.owner, `"owner" not found on whitelist[${idx}]. "owner" must be set on all whitelist items.`);
	});

	config.whitelist = config.whitelist.map((item) => ({
		owner: str2regexp(item.owner),
		repo: item.repo ? str2regexp(item.repo) : /.+/,
	}));
}

export function canAccess({ owner, repo }) {
	if (!config || !config.whitelist) { return true; }
	return config.whitelist.some(
		(whitelistItem) => whitelistItem.owner.test(owner) && whitelistItem.repo.test(repo)
	);
};
