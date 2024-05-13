import { type Coordinates, type NormalizedWeatherForecast } from '@/core/types';

export interface IWeatherClient {
	getWeatherForecastByCoordinates(
		coordinates: Coordinates,
	): Promise<NormalizedWeatherForecast | null>;
}
