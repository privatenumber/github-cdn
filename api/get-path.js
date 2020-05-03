const mime = require('mime');
const resolveRef = require('../lib/resolve-ref');
const badgenUrl = require('../lib/badgen-url');
const getPath = require('../lib/github.get-path');

const constructUrl = ({
 owner, repo, ref, badge, path = '',
}) => `/${owner}/${repo}/${ref}${path}${(badge === '') ? '?badge' : ''}`;

const redirect = (res, dest) => {
	res.setHeader('Location', dest);
	res.status(302).end();
};

module.exports = async (req, res) => {
	const query = { ...req.query, ...req.params };
	const resolved = await resolveRef(query);

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
