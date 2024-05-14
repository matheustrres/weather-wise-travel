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
	const { geocodingClient, sut, weatherForecastClient } = makeSUT();

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

	it('should throw if no forecast is found through coordinates from given address', () => {
		geocodingClient.forwardGeocodingAddress.mock.mockImplementationOnce(() => ({
			lat: -12.5515039,
			lng: -55.72023595614893,
		}));

		weatherForecastClient.getWeatherForecastByCoordinates.mock.mockImplementationOnce(
			() => null,
		);

		rejects(
			() =>
				sut.exec({
					address: 'Invalid address',
				}),
			new Error('No forecast found for given address coordinates.'),
		);
	});
});
