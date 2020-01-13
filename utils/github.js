const got = require('got');
const qs = require('querystring');
const git = require('isomorphic-git');
const assert = require('assert');
const cache = require('./cache');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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

const cacheDuration = 10000;

async function cacheFallback({ key, request }) {
	const result = {
		source: null,
		data: null,
	};

	let fallback = null;
	let cacheHit = await cache.get(key);

	if (cacheHit) {
		const cacheElapsed = Date.now() - cacheHit.created;
		if (cacheElapsed > cacheDuration) {
			fallback = cacheHit;
			cacheHit = undefined;
		} else {
			Object.assign(result, {
				source: 'cache',
				data: cacheHit.data,
			});
		}
	}

	if (!cacheHit) {
		try {
			const data = await request();
			Object.assign(result, {
				source: 'request',
				data,
			});

			cache.set(key, {
				data,
				created: Date.now(),
			});			
		} catch (err) {
			result.err = err;
			if (fallback) {
				Object.assign(result, {
					source: `fallback ${fallback.created}`,
					data: fallback.data,
				});
			}
		}
	}

	return result;
}


module.exports = {
	getRemoteInfo({ owner, repo }) {
		return cacheFallback({
			key: `refs:${owner}-${repo}`,
			request: async () => {
				const remoteInfo = await git.getRemoteInfo({
					url: `${GITHUB_HOST}/${owner}/${repo}`,
					token: GITHUB_TOKEN,
				});
				return remoteInfo.refs;
			},
		});
	},

	getFile({ owner, repo, ref, path = '/' }) {
		return cacheFallback({
			key: `contents:${owner}-${repo}-${ref}-${path}`,
			request: async () => {
				const res = await gitApi(`repos/${owner}/${repo}/contents${path}?${qs.stringify({ ref })}`);

				if (res.statusCode !== 200) {
					const err = new Error(res.body.message);
					err.statusCode = res.statusCode;
					throw err;
				}

				return res.body;
			},
		});
	},
};
