import semver from 'semver';
import { getRemoteInfo } from '../utils/github';

export default async (req, res, next) => {
	const { owner, repo, path = '/' } = req.params;
	let { ref } = req.params;

	// Resolve semver range
	if (ref === 'latest') { ref = '*'; }

	if (semver.validRange(ref)) {
		const { data: refs, err } = await getRemoteInfo({ owner, repo });

		if (err) {
			return res
				.status(err.statusCode || 500)
				.json({
					message: err.message,
					request: {
						owner, repo, ref, path,
					},
				});
		}

		const versions = Object.keys(refs.tags)
			.filter((t) => !t.endsWith('^{}'))
			.filter(semver.valid);

		const matchesVersion = semver.maxSatisfying(versions, ref);

		if (matchesVersion !== ref) {
			return res.redirect(`/${owner}/${repo}/${matchesVersion}${path}${req._parsedUrl.search || ''}`);
		}

		// Versioned assets should be immutable
		res.header('Cache-Control', 'public, max-age=31536000, immutable');
	} else {
		res.header('Cache-Control', 'public, max-age=10');		
	}

	return next();
};
