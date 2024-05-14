import { type Mock, mock } from 'node:test';

import { type IWeatherForecastTimelineClient } from '@/core/ports/clients/weather-forecast';

export type MockedWeatherForecastTimelineClient = {
	getWeatherForecastTimelineByCoordinates: Mock<
		IWeatherForecastTimelineClient['getWeatherForecastTimelineByCoordinates']
	>;
};

export const mockedWeatherForecastTimelineClient: MockedWeatherForecastTimelineClient =
	{
		getWeatherForecastTimelineByCoordinates: mock.fn(),
	};
