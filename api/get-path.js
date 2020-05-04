const mime = require('mime');
const log = require('../lib/utils/log');
const resolveRef = require('../lib/resolve-ref');
const badgenUrl = require('../lib/badgen-url');
const getPath = require('../lib/github.get-path');
const config = require('../lib/utils/config');
const redirect = require('../lib/utils/redirect');

const constructUrl = ({
 owner, repo, ref, badge, path = '',
}) => `/${owner}/${repo}/${ref}${path}${(badge === '') ? '?badge' : ''}`;

module.exports = async (req, res) => {
	log('[req:get-path]', req.url);

	const query = { ...req.cookies, ...req.query, ...req.params };

	if (!config.canAccess(query)) {
		return res.status(401).send({ err: 'Restricted access' });
	}

	const resolved = await resolveRef(query).catch((err) => {
		res.status(422).send({ err: err.message });
	});

	if (!resolved) { return; }

	const cacheAge = (!resolved.ref && resolved.type === 'version') ? '31536000, immutable' : '60';
	res.setHeader('Cache-Control', `public, max-age=${cacheAge}`);

	if (resolved.ref) {
		return redirect(res, 302, constructUrl({ ...query, ...resolved }));
	}

	const { path } = query;

	if (!path) {
		if (query.badge === '') {
			redirect(res, 301, badgenUrl(query));
		} else {
			redirect(res, 301, constructUrl({ ...query, path: '/' }));
		}
		return;
	}

	await getPath(query).then(
		({ source, data }) => {
			res.setHeader('X-GITHUB-CDN-SOURCE', source);
			res.setHeader('Content-type', mime.getType(path));
			res.send(data);
		},
		(err) => res.status(422).send({ err: err.message }),
	);
};
