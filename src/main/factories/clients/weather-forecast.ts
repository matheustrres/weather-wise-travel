import { WeatherForecastClient } from '@/infra/adapters/clients/weather-forecast';

import { makeNodeCacheProvider } from '@/main/factories/providers/cache';

export function makeWeatherForecastClient() {
	return new WeatherForecastClient({
		apiKey: process.env['VISUAL_CROSSING_API_KEY'] as string,
		cacheProvider: makeNodeCacheProvider(),
	});
}
