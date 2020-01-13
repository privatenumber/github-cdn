const got = require('got');
const { has } = require('lodash');

const badgen = ({ name, version, color = 'blue' }) => got.stream(`https://badgen.net/badge/${name}/${version}/${color}`);

module.exports = (req, res, next) => {
	const { repo, ref } = req.params;

	if (!has(req.query, 'badge')) {
		return next();
	}

	return badgen({ name: repo, version: ref })
		.on('error', (err) => res.json({ error: `Could not generate badge: ${err.message}` }))
		.pipe(res);
};
