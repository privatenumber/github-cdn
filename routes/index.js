import { Router } from 'express';
import getRepo from './getRepo';
import resolveSemver from './resolveSemver';
import serveBadgen from './serveBadgen';
import getPath from './getPath';

const router = Router();

router.get('/:owner/:repo', getRepo);

router.get(
	'/:owner/:repo/:ref:path(/*)?',
	resolveSemver,
	serveBadgen,
	getPath,
);

export default router;
