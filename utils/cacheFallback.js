import cache from './cache';

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
				console.log(`${err.message} for key "${key}"`);
				console.log(err);
			});
		} catch (err) {
			result.err = err;
			if (fallback) {
				Object.assign(result, {
					source: `fallback ${fallback.created}`,
					data: fallback.data,
				});
			}
		}
	}

	return result;
}

export default cacheFallback;
