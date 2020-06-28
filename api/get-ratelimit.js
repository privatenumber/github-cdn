const log = require('../lib/utils/log');
const githubApi = require('../lib/utils/github-api');
const { github } = require('../lib/utils/config');
const route = require('../lib/utils/route');

module.exports = route(async (req, res) => {
	log('[req:get-ratelimit]', req.url);

	const [token, source] = (() => {
		if ('token' in req.query) { return [req.query.token, 'query']; }
		if ('token' in req.cookies) { return [req.cookies.token, 'cookie']; }
		if (github.token) { return [github.token, 'server']; }
		return [undefined, 'n/a'];
	})();
	const opts = token ? { headers: { Authorization: `token ${token}` } } : undefined;
	const data = await githubApi('rate_limit', opts).json();

	res.assert(!data.message, 500, data.message);

	res.send({
		token_source: source,
		rate: data.resources.core,
	});
});
