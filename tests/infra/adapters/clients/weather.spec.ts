import { deepStrictEqual, strictEqual } from 'node:assert';
import { afterEach, describe, it } from 'node:test';

import { type ICacheProvider } from '@/core/ports/providers/cache';
import { type Coordinates, type NormalizedWeatherForecast } from '@/core/types';

import { WeatherClient } from '@/infra/adapters/clients/weather';

import weatherForecastResponseFixture from '#/data/fixtures/weather_forecast_response.json';
import {
	mockedHttpClient,
	type MockedHttpClient,
} from '#/data/mocks/http-client';
import { makeInMemoCacheProvider } from '#/impl/in-memo/providers/cache';

type SUT = {
	cacheProvider: ICacheProvider;
	httpClient: MockedHttpClient;
	sut: WeatherClient;
};

function makeSUT(): SUT {
	const cacheProvider = makeInMemoCacheProvider();
	const httpClient = mockedHttpClient;

	return {
		cacheProvider,
		httpClient,
		sut: new WeatherClient({
			apiKey: 'random_api_key',
			cacheProvider,
			httpClient,
		}),
	};
}

describe('WeatherClient', () => {
	const { cacheProvider, httpClient, sut } = makeSUT();

	afterEach(() => {
		httpClient.get.mock.resetCalls();
		cacheProvider.flush();
	});

	it('should return a normalized cached weather forecast', async () => {
		const coordinates: Coordinates = {
			lat: -22.8833282,
			lng: -47.1964317225214,
		};

		const cacheKey = sut.getWeatherForecastCacheKey(coordinates);

		await cacheProvider.set<NormalizedWeatherForecast>({
			key: cacheKey,
			value: weatherForecastResponseFixture as NormalizedWeatherForecast,
		});

		const weatherForecast =
			await sut.getWeatherForecastByCoordinates(coordinates);

		const normalizedCachedWeatherForecast = await cacheProvider.get(cacheKey);

		deepStrictEqual(weatherForecast, normalizedCachedWeatherForecast);
		strictEqual(httpClient.get.mock.callCount(), 0);
	});

	it('should return null if no weather forecast is found for given coordinates', async () => {
		httpClient.get.mock.mockImplementationOnce(() => null);

		const weatherForecast = await sut.getWeatherForecastByCoordinates({
			lat: -22.8833282,
			lng: -47.1964317225214,
		});

		deepStrictEqual(weatherForecast, null);
		strictEqual(httpClient.get.mock.callCount(), 1);
	});
});
