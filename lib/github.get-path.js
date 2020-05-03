const qs = require('querystring');
const assert = require('assert');
const got = require('got');
const nodePath = require('path');
const cacheFallback = require('./utils/cache-fallback');
const { GITHUB_API_BASE, GITHUB_TOKEN } = require('./utils/config');

// 	prefixUrl: `${GITHUB_HOST}/api/v3/`,

const gitApi = got.extend({
	prefixUrl: GITHUB_API_BASE,
	throwHttpErrors: false,
	timeout: 10000,
	headers: {
		...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}),
		Accept: 'application/vnd.github.v3.raw+json',
	},
});

const cacheDuration = 10000;

const getBlob = ({ owner, repo, sha }) => gitApi(`repos/${owner}/${repo}/git/blobs/${sha}`).text();

function getPath({
	owner, repo, ref, path = '',
}) {
	return cacheFallback({
		cacheDuration,
		key: `contents:${owner}-${repo}-${ref}-${path}`,
		request: async () => {
			const filePath = `repos/${owner}/${repo}/contents${path}`;
			const query = qs.stringify({ ref });
			const res = await gitApi(`${filePath}?${query}`);

			let { body } = res;
			if (res.headers['content-type'].indexOf('application/json') > -1) {
				body = JSON.parse(body);
			}

			if (res.statusCode !== 200) {
				const isTooLarge = body.errors && body.errors.find((e) => e.code === 'too_large');
				if (isTooLarge) {
					const dirPath = nodePath.dirname(filePath);
					const dirRes = await gitApi(`${dirPath}?${query}`).json();
					const fileName = nodePath.basename(filePath);
					const { sha } = dirRes.find((f) => f.name === fileName);
					return getBlob({ owner, repo, sha });
				}

				const err = new Error(body.message);
				err.statusCode = res.statusCode;
				throw err;
			}

			// Directory listing
			if (Array.isArray(body)) {
				return body.map(({ name, path, type }) => ({ name, path, type }));
			}

			return body;
		},
	});
}


module.exports = getPath;
