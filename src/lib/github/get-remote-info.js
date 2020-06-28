const { getRemoteInfo: igGetRemoteInfo } = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const { github } = require('../utils/config');
const cacheFallback = require('../utils/cache-fallback');
const resError = require('../utils/res-error');

const cacheDuration = 10000;

async function getRemoteInfo({
	token = github.token,
	owner,
	repo,
}) {
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
			}).catch((err) => {
				throw resError(err.data.statusCode, err.data.response);
			});

			const default_branch = HEAD.replace(/^refs\/heads\//, '');
			return { default_branch, refs };
		},
	});
}

module.exports = getRemoteInfo;
