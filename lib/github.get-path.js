const qs = require('querystring');
const got = require('got');
const nodePath = require('path');
const cacheFallback = require('./utils/cache-fallback');
const { github } = require('./utils/config');

const gitApi = got.extend({
	prefixUrl: github.apiBase,
	throwHttpErrors: false,
	timeout: 10000,
	headers: {
		...(github.token ? { Authorization: `token ${github.token}` } : {}),
		Accept: 'application/vnd.github.v3.raw+json',
	},
});

const cacheDuration = 10000;

const getBlob = ({ owner, repo, sha }) => gitApi(`repos/${owner}/${repo}/git/blobs/${sha}`).text();

function getPath({
	owner, repo, ref, path = '',
}) {
	// Github Contents API doesn't support trailing slashes in their requests
	// If given, it redirects and neglects the ref
	path = path.replace(/\/$/, '');

	return cacheFallback({
		cacheDuration,
		key: `contents:${owner}-${repo}-${ref}-${path}`,
		request: async () => {
			const reqPath = `repos/${owner}/${repo}/contents${path}`;
			const query = qs.stringify({ ref });
			const res = await gitApi(`${reqPath}?${query}`);

			let { body } = res;
			if (res.headers['content-type'].indexOf('application/json') > -1) {
				body = JSON.parse(body);
			}

			if (res.statusCode !== 200) {
				const isTooLarge = body.errors && body.errors.find((e) => e.code === 'too_large');
				if (isTooLarge) {
					const dirPath = nodePath.dirname(reqPath);
					const dirRes = await gitApi(`${dirPath}?${query}`).json();
					const fileName = nodePath.basename(reqPath);
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
