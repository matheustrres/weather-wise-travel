import { type Coordinates, type NormalizedWeatherForecast } from '@/core/types';

export interface IWeatherForecastClient {
	getWeatherForecastByCoordinates(
		coordinates: Coordinates,
	): Promise<NormalizedWeatherForecast | null>;
}
