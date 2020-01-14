import Keyv from 'keyv';
import KeyvMemcache from 'keyv-memcache';
import assert from 'assert';

assert(process.env.MEMCACHED, 'process.env.MEMCACHED is not defined');

const cache = new Keyv({
	namespace: 'git-cdn',
	store: new KeyvMemcache(process.env.MEMCACHED),
});

export default cache;
