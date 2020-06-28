const resError = (statusCode, message) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};
module.exports = resError;
