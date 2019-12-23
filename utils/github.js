const got = require('got');
const qs = require('querystring');
const git = require('isomorphic-git');
const assert = require('assert');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { GITHUB_HOST, GITHUB_TOKEN } = process.env;

assert(GITHUB_HOST, 'process.env.GITHUB_HOST is not defined');
assert(GITHUB_TOKEN, 'process.env.GITHUB_TOKEN is not defined');

const gitApi = got.extend({
	prefixUrl: `${GITHUB_HOST}/api/v3/`,
	responseType: 'json',
	throwHttpErrors: false,
	timeout: 10000,
	headers: {
		Authorization: `token ${GITHUB_TOKEN}`,
	},
});

module.exports = {
	getRemoteInfo({ owner, repo }) {
		return git.getRemoteInfo({
			url: `${GITHUB_HOST}/${owner}/${repo}`,
			token: GITHUB_TOKEN,
		});
	},

	getFile({ owner, repo, ref, path = '/' }) {
		return gitApi(`repos/${owner}/${repo}/contents${path}?${qs.stringify({ ref })}`).catch(err => ({ err }));
	},
};
