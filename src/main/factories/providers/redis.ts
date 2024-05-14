import { IORedisCacheProvider } from '@/infra/adapters/providers/cache';

export function makeRedisCacheProvider() {
	return new IORedisCacheProvider();
}
