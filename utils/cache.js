const Keyv = require('keyv');
const KeyvMemcache = require('keyv-memcache');
const assert = require('assert');

assert(process.env.MEMCACHE, 'process.env.MEMCACHE is not defined');

const store = new KeyvMemcache(process.env.MEMCACHE);

const cache = new Keyv({
	namespace: 'git-cdn',
	store,
});

module.exports = cache;
