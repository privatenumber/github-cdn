import { Router } from 'express';
import getRepo from './getRepo';
import resolveSemver from './resolveSemver';
import serveBadgen from './serveBadgen';
import getPath from './getPath';
import { canAccess } from '../lib/utils/config';

const router = Router();

router.get('/', (req, res) => {
	res
		.set('Content-Type', 'text/plain')
		.send(`# Github CDN

## Get git references of a repo
\`/:owner/:repo/\`

## Get file or list directory in repo ref
> Tip \`:ref\` can be a semver range
\`/:owner/:repo/:ref/:file-path\`

## Get repo ref badge
\`/:owner/:repo/:ref?badge\`
`);
});

router.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

// router.get(
// 	'/:owner',
// 	(req, res) => res.status(400).send({ error: 'Missing "repo" in URL' }),
// );

router.get('/:owner/:repo*', (req, res, next) => {
	if (canAccess(req.params)) {
		next();
		return;
	}

	res
		.status(401)
		.send({ error: 'Unauthorized access' });
});

// router.get('/:owner/:repo', getRepo);

router.get(
	'/:owner/:repo/:ref:path(/*)?',
	[
		resolveSemver,
		serveBadgen,
		getPath,
	],
);

export default router;
