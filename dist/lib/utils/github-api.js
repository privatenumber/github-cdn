const got = require('got');
const { github } = require('./config');
const githubApi = got.extend({
    prefixUrl: github.apiBase,
    throwHttpErrors: false,
    timeout: 10000,
    headers: {
        Accept: 'application/vnd.github.v3.raw+json',
    },
});
module.exports = githubApi;
