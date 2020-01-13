import express from 'express';
import getRepo from './routes/getRepo';
import resolveSemver from './routes/resolveSemver';
import serveBadgen from './routes/serveBadgen';
import getPath from './routes/getPath';

const router = express.Router();

router.get('/:owner/:repo', getRepo);
router.get(
	'/:owner/:repo/:ref:path(/*)?',
	resolveSemver,
	serveBadgen,
	getPath,
);

export default router;
