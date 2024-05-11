import { type Coordinates, type NormalizedForecast } from '@/core/types';

export interface IWeatherClient {
	getForecastByCoordinates(
		coordinates: Coordinates,
	): Promise<NormalizedForecast>;
}
