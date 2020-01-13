import Keyv from 'keyv';
import KeyvMemcache from 'keyv-memcache';
import assert from 'assert';

assert(process.env.MEMCACHE, 'process.env.MEMCACHE is not defined');

const cache = new Keyv({
	namespace: 'git-cdn',
	store: new KeyvMemcache(process.env.MEMCACHE),
});

export default cache;
