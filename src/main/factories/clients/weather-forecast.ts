import { WeatherForecastTimelineClient } from '@/infra/adapters/clients/weather-forecast';

import { makeNodeCacheProvider } from '@/main/factories/providers/cache';

export function makeWeatherForecastTimelineClient() {
	return new WeatherForecastTimelineClient({
		apiKey: process.env['VISUAL_CROSSING_API_KEY'] as string,
		cacheProvider: makeNodeCacheProvider(),
	});
}
