import { WeatherClient } from './infra/adapters/clients/weather';
import { IORedisCacheProvider } from './infra/adapters/providers/cache';

(async () => {
	const weatherClient = new WeatherClient({
		apiKey: process.env['VISUAL_CROSSING_API_KEY'] as string,
		cacheProvider: new IORedisCacheProvider(),
	});

	const forecast = await weatherClient.getWeatherForecastByCoordinates({
		lat: -22.9729292,
		lng: -43.4011339,
	});

	console.log(forecast);
})();
