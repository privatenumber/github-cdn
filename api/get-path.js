const mime = require('mime');
const log = require('../lib/utils/log');
const resolveRef = require('../lib/resolve-ref');
const badgenUrl = require('../lib/badgen-url');
const getPath = require('../lib/github.get-path');
const config = require('../lib/utils/config');

const constructUrl = ({
 owner, repo, ref, badge, path = '',
}) => `/${owner}/${repo}/${ref}${path}${(badge === '') ? '?badge' : ''}`;

const redirect = (res, dest) => {
	res.setHeader('Location', dest);
	res.status(302).end();
};

module.exports = async (req, res) => {
	log('[req:get-path]', req.url);
	const query = { ...req.query, ...req.params };

	if (!config.canAccess(query)) {
		return res.status(401).send({ err: 'Unauthorized access' });
	}

	const resolved = await resolveRef(query).catch((err) => {
		res.status(422).send({ err: err.message });
	});

	if (!resolved) { return; }

	const cacheAge = (!resolved.ref && resolved.type === 'version') ? '31536000, immutable' : '60';
	res.setHeader('Cache-Control', `public, max-age=${cacheAge}`);

	if (resolved.ref) {
		return redirect(res, constructUrl({ ...query, ...resolved }));
	}

	const { path } = query;

	if (!path) {
		if (query.badge === '') {
			redirect(res, badgenUrl(query));
		} else {
			redirect(res, constructUrl({ ...query, path: '/' }));
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
