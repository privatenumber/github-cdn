const got = require('got');

const badgen = ({ repo, ref }) => got.stream(`https://badgen.net/badge/${repo}/${ref}/blue`);

module.exports = badgen;
