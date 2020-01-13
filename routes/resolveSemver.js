const semver = require('semver');
const github = require('../utils/github');

module.exports = async (req, res, next) => {
	let { owner, repo, ref, path = '/' } = req.params;

	// Resolve semver range
	if (ref === 'latest') { ref = '*'; }

	if (semver.validRange(ref)) {
		const { data: refs, err } = await github.getRemoteInfo({ owner, repo });

		if (err) {
			return res
				.status(err.statusCode || 500)
				.json({
					message: err.message,
					request: { owner, repo, ref, path },
				});
		}

		const versions = Object.keys(refs.tags)
			.filter(t => !t.endsWith('^{}'))
			.filter(semver.valid);

		const matchesVersion = semver.maxSatisfying(versions, ref);

		if (matchesVersion !== ref) {
			return res.redirect(`/${owner}/${repo}/${matchesVersion}${path}${req._parsedUrl.search || ''}`);
		}
	}

	next();
};
