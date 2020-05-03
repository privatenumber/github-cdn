const landingTpl = require('../lib/landing-tpl');

module.exports = (req, res) => {
	console.log(req)
	res.send(landingTpl(req));
};
