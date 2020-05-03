import { Router } from 'express';
import landingTpl from './lib/landing-tpl';
import getRepo from './api/get-repo';
import getPath from './api/get-path';

const router = Router();

router.get('/', (req, res) => {
	res.header('Cache-Control', 'public, max-age=31536000, immutable');
	res.send(landingTpl);
});

router.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

// import { canAccess } from '../lib/utils/config';
// router.get('/:owner/:repo*', (req, res, next) => {
// 	if (canAccess(req.params)) {
// 		next();
// 		return;
// 	}

// 	res
// 		.status(401)
// 		.send({ error: 'Unauthorized access' });
// });

router.get('/:owner/:repo/:ref?:path(/*)?', getPath);
router.get('/:owner/:repo?', getRepo);

export default router;
