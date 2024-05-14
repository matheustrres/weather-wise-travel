import {
	type Coordinates,
	type NormalizedWeatherForecastTimeline,
} from '@/core/types';

export interface IWeatherForecastTimelineClient {
	getWeatherForecastTimelineByCoordinates(
		coordinates: Coordinates,
	): Promise<NormalizedWeatherForecastTimeline | null>;
}
