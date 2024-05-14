import { WeatherForecastClient } from '@/infra/adapters/clients/weather-forecast';

import { makeRedisCacheProvider } from '@/main/factories/providers/redis';

export function makeWeatherForecastClient() {
	return new WeatherForecastClient({
		apiKey: process.env['VISUAL_CROSSING_API_KEY'] as string,
		cacheProvider: makeRedisCacheProvider(),
	});
}
