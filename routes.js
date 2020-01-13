const express = require('express');
const cache = require('./utils/cache');
const github = require('./utils/github');
const badgen = require('./utils/badgen');

const semver = require('semver');

const cacheDuration = 10000;

const router = express.Router();

router.get('/:owner/:repo', require('./routes/getRepo'));

router.get('/:owner/:repo/:ref:path(/*)?', async (req, res) => {
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

	// Serve badge
	if (req.query.hasOwnProperty('badge')) {
		badgen({ name: repo, version: ref })
			.on('error', (err) => res.json({ error: 'Could not generate badge: ' + err.message }))
			.pipe(res);
		return;
	}

	// Get file
	const { err, source, data: file } = await github.getFile({ owner, repo, ref, path });

	if (err) {
		return res
			.status(err.statusCode || 500)
			.json({
				message: err.message,
				request: { owner, repo, ref, path },
			});
	}

	res.header('GIT-CDN-SOURCE', source);

	if (Array.isArray(file)) {
		return res.json(file.map(({ name, path, type }) => ({ name, path, type })));
	}

	const content = Buffer.from(file.content, 'base64').toString();
	res.end(content);
});

module.exports = router;
