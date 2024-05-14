import { WeatherForecastUseCase } from '@/appl/use-cases/weather-forecast';

import { makeGeocodingClient } from '@/main/factories/clients/geocoding';
import { makeWeatherForecastClient } from '@/main/factories/clients/weather-forecast';

export function makeWeatherForecastUseCase(): WeatherForecastUseCase {
	return new WeatherForecastUseCase(
		makeGeocodingClient(),
		makeWeatherForecastClient(),
	);
}
