import { type Mock, mock } from 'node:test';

import { type IWeatherForecastClient } from '@/core/ports/clients/weather-forecast';

export type MockedWeatherForecastClient = {
	getWeatherForecastByCoordinates: Mock<
		IWeatherForecastClient['getWeatherForecastByCoordinates']
	>;
};

export const mockedWeatherForecastClient: MockedWeatherForecastClient = {
	getWeatherForecastByCoordinates: mock.fn(),
};
