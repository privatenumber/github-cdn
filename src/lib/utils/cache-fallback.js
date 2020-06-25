const log = require('./log');
const cache = require('./cache');

async function cacheFallback({
	cacheDuration,
	key,
	request,
}) {
	const result = {
		source: null,
		data: null,
	};

	let fallback = null;
	let cacheHit = await cache.get(key);

	if (cacheHit) {
		const cacheElapsed = Date.now() - cacheHit.created;
		if (cacheElapsed > cacheDuration) {
			fallback = cacheHit;
			cacheHit = undefined;
		} else {
			Object.assign(result, {
				source: 'cache',
				data: cacheHit.data,
			});
		}
	}

	if (!cacheHit) {
		try {
			const data = await request();
			Object.assign(result, {
				source: 'request',
				data,
			});

			cache.set(key, {
				data,
				created: Date.now(),
			}).catch((err) => {
				log(`[cache-fallback] Cache set: ${err.message} for key "${key}"`);
				log(err);
			});
		} catch (err) {
			if (fallback) {
				Object.assign(result, {
					source: `fallback ${fallback.created}`,
					data: fallback.data,
					err,
				});
			} else {
				throw err;
			}
		}
	}

	return result;
}

module.exports = cacheFallback;
