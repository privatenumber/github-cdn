const mime = require('mime');
const log = require('../lib/utils/log');
const route = require('../lib/utils/route');
const getGist = require('../lib/github/get-gist');

module.exports = route(async (req, res) => {
	log('[req:get-gist]', req.url);

	const query = { ...req.cookies, ...req.query, ...req.params };

	res.assert(query.gistId, 422, '`gistId` must be passed in');

	const { source, data } = await getGist(query);

	res
		.headers({
			'X-GITHUB-CDN-SOURCE': source,
			'Content-type': mime.getType(query.path),
		})
		.send(data);
});
