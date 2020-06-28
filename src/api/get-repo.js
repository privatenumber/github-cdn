const log = require('../lib/utils/log');
const getRemoteInfo = require('../lib/github/get-remote-info');
const config = require('../lib/utils/config');
const route = require('../lib/utils/route');

module.exports = route(async (req, res) => {
	log('[req:get-repo]', req.url);

	const query = { ...req.cookies, ...req.query, ...req.params };

	res
		.assert(config.canAccess(query), 401, 'Restricted access')
		.assert(query.owner, 422, '`owner` must be passed in')
		.assert(query.repo, 422, '`repo` must be passed in');

	if (!new URL(req.url, 'http://a').pathname.endsWith('/')) {
		return res.redirect(301, `/${query.owner}/${query.repo}/`);
	}

	const { source, data } = await getRemoteInfo(query);
	res.headers({
		'X-GITHUB-CDN-SOURCE': source,
		'Cache-Control': `${query.token ? 'private' : 'public'}, max-age=60`,
	}).send(data);
});
