const log = require('../lib/utils/log');
const getRemoteInfo = require('../lib/github.get-remote-info');
const config = require('../lib/utils/config');

module.exports = (req, res) => {
	log('[req:get-repo]', req.url);

	const query = { ...req.cookies, ...req.query, ...req.params };

	if (!config.canAccess(query)) {
		return res.status(401).send({ err: 'Restricted access' });
	}

	getRemoteInfo(query).then(
		({ source, data }) => {
			res.setHeader('X-GITHUB-CDN-SOURCE', source);
			res.setHeader('Cache-Control', 'public, max-age=60, immutable');
			res.send(data);
		},
		(err) => res.status(422).send({ err: err.message }),
	);
};
