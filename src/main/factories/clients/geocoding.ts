import { GeocodingClient } from '@/infra/adapters/clients/geocoding';

import { makeRedisCacheProvider } from '@/main/factories/providers/redis';

export function makeGeocodingClient(): GeocodingClient {
	return new GeocodingClient({
		apiKey: process.env['GEOCODE_API_KEY'] as string,
		cacheProvider: makeRedisCacheProvider(),
	});
}
