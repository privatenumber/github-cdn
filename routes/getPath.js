const cache = require('../utils/cache');
const github = require('../utils/github');

module.exports = async (req, res) => {
	const { owner, repo, ref, path = '/' } = req.params;

	const { err, source, data: pathData } = await github.getPath({ owner, repo, ref, path });

	if (err) {
		return res
			.status(err.statusCode || 500)
			.json({
				message: err.message,
				request: { owner, repo, ref, path },
			});
	}

	res.header('GIT-CDN-SOURCE', source);

	if (Array.isArray(pathData)) {
		return res.json(pathData.map(({ name, path, type }) => ({ name, path, type })));
	}

	const content = Buffer.from(pathData.content, 'base64').toString();
	res.end(content);
}