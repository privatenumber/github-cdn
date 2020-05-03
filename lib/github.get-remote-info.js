const assert = require('assert');
const { getRemoteInfo: igGetRemoteInfo } = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const { github } = require('./utils/config');
const cacheFallback = require('./utils/cache-fallback');

const cacheDuration = 10000;

async function getRemoteInfo({ token = github.token, owner, repo }) {
	assert(owner, '`owner` must be passed in');
	assert(repo, '`repo` must be passed in');

	return cacheFallback({
		cacheDuration,
		key: `refs:${token}-${owner}-${repo}`,
		request: async () => {
			const { HEAD, refs } = await igGetRemoteInfo({
				http,
				url: `${github.base}/${owner}/${repo}.git`,
				onAuth: () => ({
					username: token,
					password: 'x-oauth-basic',
				}),
			});

			const default_branch = HEAD.replace(/^refs\/heads\//, '');
			return { default_branch, refs };
		},
	});
}

module.exports = getRemoteInfo;
