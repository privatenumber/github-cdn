const log = require('../lib/utils/log');
const githubApi = require('../lib/utils/github-api');
const { github } = require('../lib/utils/config');
const route = require('../lib/utils/route');

module.exports = route(async (req, res) => {
	log('[req:get-ratelimit]', req.url);

	// TODO: support query.token
	const token = req.cookies.token || github.token;

	const opts = token ? { headers: { Authorization: `token ${token}` } } : undefined;

	const data = await githubApi('rate_limit', opts).json();

	res.assert(!data.message, 500, data.message);

	res.send({
		token_source: (req.cookies.token ? 'Cookie' : (github.token ? 'Server' : 'N/A')),
		rate: data.resources.core,
	});
});
