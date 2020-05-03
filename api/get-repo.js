const getRemoteInfo = require('../lib/github.get-remote-info');

module.exports = (req, res) => {
	getRemoteInfo({ ...req.query, ...req.params }).then(
		({ source, data }) => {
			res.setHeader('X-GITHUB-CDN-SOURCE', source);
			res.setHeader('Cache-Control', 'public, max-age=60, immutable');
			res.send(data);
		},
		(err) => res.status(422).send({ err: err.message }),
	);
};
