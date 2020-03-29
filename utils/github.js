import qs from 'querystring';
import assert from 'assert';
import got from 'got';
import nodePath from 'path';
import { getRemoteInfo as igGetRemoteInfo } from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import cacheFallback from './cacheFallback';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { GITHUB_TOKEN } = process.env;
let { GITHUB_HOST } = process.env;

assert(GITHUB_HOST, 'process.env.GITHUB_HOST is not defined');
assert(GITHUB_TOKEN, 'process.env.GITHUB_TOKEN is not defined');

if (!/^https?:\/\//.test(GITHUB_HOST)) {
	GITHUB_HOST = `https://${GITHUB_HOST}`;
}

const gitApi = got.extend({
	prefixUrl: `${GITHUB_HOST}/api/v3/`,
	throwHttpErrors: false,
	timeout: 10000,
	headers: {
		Authorization: `token ${GITHUB_TOKEN}`,
		Accept: 'application/vnd.github.v3.raw+json',
	},
});

const cacheDuration = 10000;

const auth = {
	username: GITHUB_TOKEN,
	password: 'x-oauth-basic',
};
export function getRemoteInfo({ owner, repo }) {
	return cacheFallback({
		cacheDuration,
		key: `refs:${owner}-${repo}`,
		request: async () => {
			const remoteInfo = await igGetRemoteInfo({
				http,
				url: `${GITHUB_HOST}/${owner}/${repo}.git`,
				onAuth: () => auth,
			});
			return remoteInfo.refs;
		},
	});
}

function getBlob({ owner, repo, sha }) {
	return gitApi(`repos/${owner}/${repo}/git/blobs/${sha}`).text();
}

export function getPath({
	owner, repo, ref, path = '',
}) {
	let cleanPath = path;

	if (cleanPath.endsWith('/')) {
		cleanPath = cleanPath.slice(0, -1);
	}

	return cacheFallback({
		cacheDuration,
		key: `contents:${owner}-${repo}-${ref}-${cleanPath}`,
		request: async () => {
			const filePath = `repos/${owner}/${repo}/contents${cleanPath}`;
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

			return body;
		},
	});
}
