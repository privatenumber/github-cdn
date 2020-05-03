const Keyv = require('keyv');

const { MEMCACHED } = process.env;

let store;
if (MEMCACHED) {
	const KeyvMemcache = require('keyv-memcache');
	store = new KeyvMemcache(MEMCACHED);
} else {
	store = new Map();
}

const cache = new Keyv({
	namespace: 'git-cdn',
	store,
});

cache.on('error', (err) => {
	console.log('Keyv error:', err);
});

module.exports = cache;
