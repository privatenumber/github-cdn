const assert = require('assert');
const log = require('../lib/utils/log');
const getRemoteInfo = require('../lib/github.get-remote-info');
const config = require('../lib/utils/config');
const redirect = require('../lib/utils/redirect');

module.exports = (req, res) => {
	log('[req:get-repo]', req.url);

	const query = { ...req.cookies, ...req.query, ...req.params };

	if (!config.canAccess(query)) {
		return res.status(401).send({ err: 'Restricted access' });
	}

	assert(query.owner, '`owner` must be passed in');
	assert(query.repo, '`repo` must be passed in');

	if (!new URL(req.url, 'http://a').pathname.endsWith('/')) {
		return redirect(res, 301, `/${query.owner}/${query.repo}/`);
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
