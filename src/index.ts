import { VisualCrossingWeatherClient } from './infra/adapters/clients/weather';
import { IORedisCacheProvider } from './infra/adapters/providers/cache';

(async () => {
	const visualcrossingClient = new VisualCrossingWeatherClient({
		apiKey: process.env['VISUAL_CROSSING_API_KEY'] as string,
		cacheProvider: new IORedisCacheProvider(),
	});

	const forecast = await visualcrossingClient.getForecastByCoordinates({
		lat: -22.9729292,
		lng: -43.4011339,
	});

	console.log(forecast);
})();
