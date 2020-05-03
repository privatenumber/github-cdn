const mime = require('mime');
const resolveRef = require('../lib/resolve-ref');
const badgen = require('../lib/badgen');
const getPath = require('../lib/github.get-path');

const constructUrl = ({ owner, repo, ref, badge, path }) => `/${owner}/${repo}/${ref}${path}${(badge === '')? '?badge' : ''}`;

const redirect = (res, dest) => {
	res.setHeader('Location', dest);
	res.status(302).end();
};

module.exports = async (req, res) => {
	const { query } = req;

	const resolved = await resolveRef(query);

	const cacheAge = (!resolved.ref && resolved.type === 'version') ? '31536000, immutable' : '10';
	res.setHeader('Cache-Control', `public, max-age=${cacheAge}`);

	if (resolved.ref) {
		return redirect(res, constructUrl({ ...query, ...resolved }));
	}

	const { path } = query;

	if (!path) {
		if (query.badge === '') {
			badgen(query)
				.on('error', (err) => res.status(502).send({ error: `Could not generate badge: ${err.message}` }))
				.pipe(res);
		} else {
			redirect(res, constructUrl({ ...query, path: '/' }));
		}
		return;
	}

	const { source, data } = await getPath(query);
	res.setHeader('Content-type', mime.getType(query.path));
	res.send(data);
};
