const got = require('got');
const badgen = ({ name, version, color = 'blue' }) => got.stream(`https://badgen.net/badge/${name}/${version}/${color}`);

module.exports = badgen;
