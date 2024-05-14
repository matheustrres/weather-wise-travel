import { GeocodingClient } from '@/infra/adapters/clients/geocoding';

import { makeNodeCacheProvider } from '@/main/factories/providers/cache';

export function makeGeocodingClient(): GeocodingClient {
	return new GeocodingClient({
		apiKey: process.env['GEOCODE_API_KEY'] as string,
		cacheProvider: makeNodeCacheProvider(),
	});
}
