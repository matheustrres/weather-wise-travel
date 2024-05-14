import { rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { WeatherForecastUseCase } from '@/appl/use-cases/weather-forecast';

import {
	type MockedGeocodingClient,
	mockedGeocodingClient,
} from '#/data/mocks/geocoding-client';
import {
	type MockedWeatherForecastClient,
	mockedWeatherForecastClient,
} from '#/data/mocks/weather-forecast-client';

type SUT = {
	geocodingClient: MockedGeocodingClient;
	weatherForecastClient: MockedWeatherForecastClient;
	sut: WeatherForecastUseCase;
};

function makeSUT(): SUT {
	const geocodingClient = mockedGeocodingClient;
	const weatherForecastClient = mockedWeatherForecastClient;

	return {
		geocodingClient,
		weatherForecastClient,
		sut: new WeatherForecastUseCase(geocodingClient, weatherForecastClient),
	};
}

describe('WeatherForecast use case', () => {
	const { geocodingClient, sut } = makeSUT();

	it('should throw if no geocoding address if found for given address', () => {
		geocodingClient.forwardGeocodingAddress.mock.mockImplementationOnce(
			() => null,
		);

		rejects(
			() =>
				sut.exec({
					address: 'Invalid address',
				}),
			new Error('An invalid address were provided.'),
		);
	});
});
