import { GeocodingClient } from './infra/adapters/clients/geocoding';
import { WeatherClient } from './infra/adapters/clients/weather';
import { IORedisCacheProvider } from './infra/adapters/providers/cache';

(async () => {
	const cacheProvider = new IORedisCacheProvider();

	const geocodingClient = new GeocodingClient({
		apiKey: process.env['GEOCODE_API_KEY'] as string,
		cacheProvider,
	});

	const weatherClient = new WeatherClient({
		apiKey: process.env['VISUAL_CROSSING_API_KEY'] as string,
		cacheProvider,
	});

	const coordinates = await geocodingClient.forwardGeocodingAddress(
		'Shopping Metropolitano',
	);

	const weatherForecast = await weatherClient.getWeatherForecastByCoordinates(
		coordinates!,
	);

	console.log(JSON.stringify(weatherForecast));
})();
