const log = require('../lib/utils/log');
const githubApi = require('../lib/utils/github-api');
const { github } = require('../lib/utils/config');

module.exports = async (req, res) => {
	log('[req:get-ratelimit]', req.url);

	const { token = github.token } = req.cookies;
	const opts = token ? { headers: { Authorization: `token ${token}` } } : undefined;
	const data = await githubApi('rate_limit').json();

	res.send({
		token_source: ('token' in req.cookies ? 'Cookie' : ( github.token ? 'Server' : 'N/A')),
		rate: data.resources.core,
	});
};
