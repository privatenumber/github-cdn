const express = require('express');

const router = express.Router();

router.get('/:owner/:repo', require('./routes/getRepo'));

router.get(
	'/:owner/:repo/:ref:path(/*)?',
	require('./routes/resolveSemver'),
	require('./routes/serveBadgen'),
	require('./routes/getPath')
);

module.exports = router;
