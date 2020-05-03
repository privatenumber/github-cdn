const assert = require('assert');
const { getRemoteInfo: igGetRemoteInfo } = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const { GITHUB_HOST, GITHUB_TOKEN } = require('./utils/config');
const cacheFallback = require('./utils/cache-fallback');

const cacheDuration = 10000;

const auth = {
	username: GITHUB_TOKEN,
	password: 'x-oauth-basic',
};

async function getRemoteInfo({ owner, repo }) {
	assert(owner, '`owner` must be passed in');
	assert(repo, '`repo` must be passed in');

	return cacheFallback({
		cacheDuration,
		key: `refs:${owner}-${repo}`,
		request: async () => {
			const { HEAD, refs } = await igGetRemoteInfo({
				http,
				url: `${GITHUB_HOST}/${owner}/${repo}.git`,
				onAuth: () => auth,
			});

			const defaultBranch = HEAD.replace(/^refs\/heads\//, '');
			return { defaultBranch, refs };
		},
	});
}

module.exports = getRemoteInfo;
