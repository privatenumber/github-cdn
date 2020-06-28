const Keyv = require('keyv');
const log = require('./log');
const { memcached } = require('./config');

let store;
if (memcached) {
	log(`[cache] Using memcached "${memcached}"`);
	const KeyvMemcache = require('keyv-memcache');
	store = new KeyvMemcache(memcached);
} else {
	log('[cache] Falling back to Map');
	store = new Map();
}

const cache = new Keyv({
	namespace: 'git-cdn',
	store,
});

cache.on('error', (err) => log('[keyv error]', err));

module.exports = cache;
