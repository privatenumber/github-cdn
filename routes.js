const express = require('express');
const cache = require('./utils/cache');
const github = require('./utils/github');

const cacheDuration = 10000;

const router = express.Router();

router.get('/:owner/:repo', async (req, res) => {
	const { owner, repo } = req.params;
	const key = `refs:${owner}-${repo}`;

	let refs = await cache.get(key);
	const cacheHit = !!refs;

	if (!cacheHit) {
		const remoteInfo = await github.getRemoteInfo({ owner, repo });
		refs = remoteInfo.refs;
		cache.set(key, refs, cacheDuration);
	}

	res
		.header('GIT-CDN-CACHE', cacheHit)
		.json(refs);
});

router.get('/:owner/:repo/:ref:path(/*)?', async (req, res) => {
	const { owner, repo, ref, path = '/' } = req.params;
	const key = `contents:${owner}-${repo}-${ref}-${path}`;

	let data = await cache.get(key);
	const cacheHit = !!data;
	if (!cacheHit) {
		const gitRes = await github.getFile({ owner, repo, ref, path });

		if (gitRes.err) {
			return res
				.status(500)
				.json({ message: gitRes.err.message });
		}

		if (gitRes.statusCode !== 200) {
			return res
				.status(gitRes.statusCode)
				.json({
					message: gitRes.body.message,
					request: { owner, repo, ref, path },
				});
		}
		data = gitRes.body;
		cache.set(key, data, cacheDuration);
	}

	res.header('GIT-CDN-CACHE', cacheHit);

	if (Array.isArray(data)) {
		return res.json(data.map(({ name, path, type }) => ({ name, path, type })));
	}

	const content = Buffer.from(data.content, 'base64').toString();
	res.end(content);
});

module.exports = router;
