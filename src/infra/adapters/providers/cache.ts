import NodeCache from 'node-cache';

import {
	type CacheSetOptions,
	type ICacheProvider,
} from '@/core/ports/providers/cache';

export class NodeCacheProvider implements ICacheProvider {
	readonly #cacheManager: NodeCache;

	constructor() {
		this.#cacheManager = new NodeCache({
			deleteOnExpire: true,
		});
	}

	async del(key: string): Promise<void> {
		this.#cacheManager.del(key);
	}

	async flush(): Promise<void> {
		this.#cacheManager.flushAll();
	}

	async get<T>(key: string): Promise<T | null> {
		const data = this.#cacheManager.get<string>(key);

		if (!data) return null;

		return JSON.parse(data) as T;
	}

	async set<T>({
		key,
		value,
		ttlInSeconds,
	}: CacheSetOptions<T>): Promise<void> {
		this.#cacheManager.set(key, JSON.stringify(value));

		if (ttlInSeconds) {
			this.#cacheManager.ttl(key, ttlInSeconds);
		}
	}
}
