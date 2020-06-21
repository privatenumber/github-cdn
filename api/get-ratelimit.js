const log = require('../lib/utils/log');
const githubApi = require('../lib/utils/github-api');
const { github } = require('../lib/utils/config');
const route = require('../lib/utils/route');

module.exports = route(async (req, res) => {
	log('[req:get-ratelimit]', req.url);

	const [token, source] = (() => {
		if (req.query.token) { return [req.query.token, 'query']; }
		if (req.cookies.token) { return [req.cookies.token, 'cookie']; }
		if (github.token) { return [github.token, 'server']; }
		return [, 'n/a'];
	})();
	const opts = token ? { headers: { Authorization: `token ${token}` } } : undefined;
	const data = await githubApi('rate_limit', opts).json();

	res.assert(!data.message, 500, data.message);

	res.send({
		token_source: source,
		rate: data.resources.core,
	});
});
