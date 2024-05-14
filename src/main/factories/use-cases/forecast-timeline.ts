import { GetAddressWeatherForecastTimelineUseCase } from '@/appl/use-cases/forecast-timeline';

import { makeGeocodingClient } from '@/main/factories/clients/geocoding';
import { makeWeatherForecastTimelineClient } from '@/main/factories/clients/weather-forecast';

export function makeGetAddressWeatherForecastTimelineUseCase(): GetAddressWeatherForecastTimelineUseCase {
	return new GetAddressWeatherForecastTimelineUseCase(
		makeGeocodingClient(),
		makeWeatherForecastTimelineClient(),
	);
}
