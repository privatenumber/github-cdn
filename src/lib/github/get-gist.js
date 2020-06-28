const got = require('got');
const cacheFallback = require('../utils/cache-fallback');
const githubApi = require('../utils/github-api');
const { github } = require('../utils/config');
const resError = require('../utils/res-error');
const config = require('../utils/config');

const cacheDuration = 10000;

function getGist({
	token = github.token,
	gistId,
	path = '',
}) {
	return cacheFallback({
		cacheDuration,
		key: `gist:${token}-${gistId}-${path}`,
		request: async () => {
			const opts = token ? { headers: { Authorization: `token ${token}` } } : undefined;
			const res = await githubApi(`gists/${gistId}`, opts);

			if (res.statusCode !== 200) {
				let msg = res.body;
				try {
					msg = JSON.parse(msg).message;
				} catch {}
				throw resError(res.statusCode, msg);
			}

			const data = JSON.parse(res.body);

			if (!config.canAccess({ owner: data.owner.login, gists: true })) {
				throw resError(401, 'Restricted access');
			}

			if (path) {
				const file = data.files[path];
				if (!file) {
					throw resError(404, `"${path}" not found`);
				}

				if (file.truncated || file.type.startsWith('image/')) {
					return got(file.raw_url).buffer();
				}

				return file.content;
			}

			// Gist meta data
			return {
				url: data.html_url,
				owner: data.owner.login,
				created_at: data.created_at,
				updated_at: data.updated_at,
				files: Object.keys(data.files),
			};
		},
	});
}


module.exports = getGist;
