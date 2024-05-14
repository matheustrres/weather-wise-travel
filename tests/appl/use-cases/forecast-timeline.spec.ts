import { deepStrictEqual, rejects } from 'node:assert';
import { describe, it } from 'node:test';

import { GetAddressWeatherForecastTimelineUseCase } from '@/appl/use-cases/forecast-timeline';

import normalizedWeatherForecastTimelineResponseFixture from '#/data/fixtures/normalized_weather_forecast_timeline_response.json';
import {
	type MockedWeatherForecastTimelineClient,
	mockedWeatherForecastTimelineClient,
} from '#/data/mocks/forecast-timeline-client';
import {
	type MockedGeocodingClient,
	mockedGeocodingClient,
} from '#/data/mocks/geocoding-client';

type SUT = {
	geocodingClient: MockedGeocodingClient;
	weatherForecastTimelineClient: MockedWeatherForecastTimelineClient;
	sut: GetAddressWeatherForecastTimelineUseCase;
};

function makeSUT(): SUT {
	const geocodingClient = mockedGeocodingClient;
	const weatherForecastTimelineClient = mockedWeatherForecastTimelineClient;

	return {
		geocodingClient,
		weatherForecastTimelineClient,
		sut: new GetAddressWeatherForecastTimelineUseCase(
			geocodingClient,
			weatherForecastTimelineClient,
		),
	};
}

describe('GetAddressWeatherForecastTimeline use case', () => {
	const { geocodingClient, sut, weatherForecastTimelineClient } = makeSUT();

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

	it('should throw if no forecast timeline is found through coordinates from given address', () => {
		geocodingClient.forwardGeocodingAddress.mock.mockImplementationOnce(() => ({
			lat: -12.5515039,
			lng: -55.72023595614893,
		}));

		weatherForecastTimelineClient.getWeatherForecastTimelineByCoordinates.mock.mockImplementationOnce(
			() => null,
		);

		rejects(
			() =>
				sut.exec({
					address: 'Random address',
				}),
			new Error('No forecast timeline were found for given address.'),
		);
	});

	it('should get a weather forecast timeline for a given address', async () => {
		geocodingClient.forwardGeocodingAddress.mock.mockImplementationOnce(() => ({
			lat: -12.5515039,
			lng: -55.72023595614893,
		}));

		weatherForecastTimelineClient.getWeatherForecastTimelineByCoordinates.mock.mockImplementationOnce(
			() => normalizedWeatherForecastTimelineResponseFixture,
		);

		const { timeline } = await sut.exec({ address: 'Rue Saint-Rustique' });

		deepStrictEqual(timeline, normalizedWeatherForecastTimelineResponseFixture);
	});
});
