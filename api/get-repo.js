const getRemoteInfo = require('../lib/github.get-remote-info');

module.exports = async (req, res) => {
	try {
		const { source, data } = await getRemoteInfo(req.query);
		res.setHeader('X-GITHUB-CDN-SOURCE', source);
		res.send(data);
	} catch (err) {
		res
			.status(422)
			.send({
				err: err.message,
			});
	}
};
