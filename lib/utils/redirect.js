const redirect = (res, statusCode, dest) => {
	res.setHeader('Location', dest);
	res.status(statusCode).end();
};

module.exports = redirect;
