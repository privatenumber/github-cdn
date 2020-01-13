const github = require('../utils/github');
const cache = require('../utils/cache');

const cacheDuration = 10000;

module.exports = async (req, res) => {
	const { owner, repo } = req.params;
	const { source, data: remoteInfo } = await github.getRemoteInfo({ owner, repo });

	res
		.header('GIT-CDN-SOURCE', source)
		.json(remoteInfo);
};
