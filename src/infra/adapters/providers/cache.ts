import IORedis from 'ioredis';

import {
	type CacheSetOptions,
	type ICacheProvider,
} from '@/core/ports/providers/cache';

export class IORedisCacheProvider implements ICacheProvider {
	readonly #redis = new IORedis('redis://localhost:6379/0');

	async del(key: string): Promise<void> {
		await this.#redis.del(key);
	}

	async flush(): Promise<void> {
		await this.#redis.flushall();
	}

	async get<T>(key: string): Promise<T | null> {
		const data = await this.#redis.get(key);

		if (!data) return null;

		return JSON.parse(data) as T;
	}

	async set<T>({
		key,
		value,
		ttlInSeconds,
	}: CacheSetOptions<T>): Promise<void> {
		await this.#redis.set(key, JSON.stringify(value));

		if (ttlInSeconds) {
			await this.#redis.expire(key, ttlInSeconds);
		}
	}
}
