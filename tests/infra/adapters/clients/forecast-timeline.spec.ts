import { deepStrictEqual, strictEqual } from 'node:assert';
import { afterEach, describe, it } from 'node:test';

import { type ICacheProvider } from '@/core/ports/providers/cache';
import {
	type Coordinates,
	type NormalizedWeatherForecastTimeline,
} from '@/core/types';

import { WeatherForecastTimelineClient } from '@/infra/adapters/clients/weather-forecast';

import normalizedWeatherForecastTimelineResponseFixture from '#/data/fixtures/normalized_weather_forecast_timeline_response.json';
import weatherForecastTimelineResponseFixture from '#/data/fixtures/weather_forecast_timeline_response.json';
import {
	mockedHttpClient,
	type MockedHttpClient,
} from '#/data/mocks/http-client';
import { makeInMemoCacheProvider } from '#/impl/in-memo/providers/cache';

type SUT = {
	cacheProvider: ICacheProvider;
	httpClient: MockedHttpClient;
	sut: WeatherForecastTimelineClient;
};

function makeSUT(): SUT {
	const cacheProvider = makeInMemoCacheProvider();
	const httpClient = mockedHttpClient;

	return {
		cacheProvider,
		httpClient,
		sut: new WeatherForecastTimelineClient({
			apiKey: 'random_api_key',
			cacheProvider,
			httpClient,
		}),
	};
}

describe('WeatherForecastTimelineClient', () => {
	const { cacheProvider, httpClient, sut } = makeSUT();

	afterEach(() => {
		httpClient.get.mock.resetCalls();
		cacheProvider.flush();
	});

	it('should return a normalized cached weather forecast timeline', async () => {
		const coordinates: Coordinates = {
			lat: -22.8833282,
			lng: -47.1964317225214,
		};

		const cacheKey = sut.getWeatherForecastCacheKey(coordinates);

		await cacheProvider.set<NormalizedWeatherForecastTimeline>({
			key: cacheKey,
			value:
				normalizedWeatherForecastTimelineResponseFixture as NormalizedWeatherForecastTimeline,
		});

		const forecastTimeline =
			await sut.getWeatherForecastTimelineByCoordinates(coordinates);

		const cachedForecastTimeline = await cacheProvider.get(cacheKey);

		deepStrictEqual(forecastTimeline, cachedForecastTimeline);
		strictEqual(httpClient.get.mock.callCount(), 0);
	});

	it('should return null if no weather forecast timeline is found for given coordinates', async () => {
		httpClient.get.mock.mockImplementationOnce(() => null);

		const forecastTimeline = await sut.getWeatherForecastTimelineByCoordinates({
			lat: -22.8833282,
			lng: -47.1964317225214,
		});

		deepStrictEqual(forecastTimeline, null);
		strictEqual(httpClient.get.mock.callCount(), 1);
		deepStrictEqual(httpClient.get.mock.calls[0]!.result, null);
	});

	it('should return a normalized weather forecast timeline and add its value to cache', async () => {
		httpClient.get.mock.mockImplementationOnce(
			() => weatherForecastTimelineResponseFixture,
		);

		const coordinates: Coordinates = {
			lat: -22.8833282,
			lng: -47.1964317225214,
		};

		const forecastTimeline =
			await sut.getWeatherForecastTimelineByCoordinates(coordinates);

		const cachedData = await cacheProvider.get(
			sut.getWeatherForecastCacheKey(coordinates),
		);

		deepStrictEqual(
			forecastTimeline,
			normalizedWeatherForecastTimelineResponseFixture,
		);
		deepStrictEqual(cachedData, forecastTimeline);
		strictEqual(httpClient.get.mock.callCount(), 1);
	});
});
