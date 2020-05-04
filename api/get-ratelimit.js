const log = require('../lib/utils/log');
const githubApi = require('../lib/utils/github-api');
const { github } = require('../lib/utils/config');

module.exports = async (req, res) => {
	log('[req:get-ratelimit]', req.url);

	const token = req.cookies.token || github.token;

	const opts = token ? { headers: { Authorization: `token ${token}` } } : undefined;

	githubApi('rate_limit', opts).json().then(
		(data) => {
			if (data.message) {
				return res.status(500).send({ err: data.message });
			}
			res.send({
				token_source: (req.cookies.token ? 'Cookie' : (github.token ? 'Server' : 'N/A')),
				rate: data.resources.core,
			});
		},
		(err) => {
			res.status(500).send({ err: 'Error fetching rate limit data' });
		},
	);
};
