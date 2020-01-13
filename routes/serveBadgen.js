import got from 'got';
import { has } from 'lodash';

const badgen = ({ name, version, color = 'blue' }) => got.stream(`https://badgen.net/badge/${name}/${version}/${color}`);

export default (req, res, next) => {
	const { repo, ref } = req.params;

	if (!has(req.query, 'badge')) {
		return next();
	}

	return badgen({ name: repo, version: ref })
		.on('error', (err) => res.json({ error: `Could not generate badge: ${err.message}` }))
		.pipe(res);
};
