import {
	type CacheSetOptions,
	type ICacheProvider,
} from '@/core/ports/providers/cache';

class InMemoCacheProvider implements ICacheProvider {
	#cacheManager = new Map<string, unknown>();

	async del(key: string): Promise<void> {
		this.#cacheManager.delete(key);
	}

	async get<T>(key: string): Promise<T | null> {
		const val = this.#cacheManager.get(key);

		if (!val) return null;

		return JSON.parse(JSON.stringify(val));
	}

	async set<T>({ key, value }: CacheSetOptions<T>): Promise<void> {
		this.#cacheManager.set(key, value);
	}

	async flush(): Promise<void> {
		this.#cacheManager.clear();
	}
}

export function makeInMemoCacheProvider() {
	return new InMemoCacheProvider();
}
