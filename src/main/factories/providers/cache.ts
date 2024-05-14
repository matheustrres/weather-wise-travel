import { NodeCacheProvider } from '@/infra/adapters/providers/cache';

export function makeNodeCacheProvider() {
	return new NodeCacheProvider();
}
