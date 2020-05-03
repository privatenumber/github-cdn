const { Router } = require('express');
const serveLanding = require('./api/serve-landing');
const getRepo = require('./api/get-repo');
const getPath = require('./api/get-path');

const router = Router();

router.get('/', serveLanding);

router.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

router.get('/:owner/:repo/:ref?:path(/*)?', getPath);
router.get('/:owner/:repo?', getRepo);

module.exports = router;
