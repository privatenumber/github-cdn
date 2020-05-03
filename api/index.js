const landingTpl = require('../lib/landing-tpl');

module.exports = (req, res) => {
	res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
	res.send(landingTpl);
};
