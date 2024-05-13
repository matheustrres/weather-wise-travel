import { deepStrictEqual, strictEqual } from 'node:assert';
import { afterEach, describe, it } from 'node:test';

import { type ICacheProvider } from '@/core/ports/providers/cache';
import { type Coordinates, type NormalizedWeatherForecast } from '@/core/types';

import { WeatherForecastClient } from '@/infra/adapters/clients/weather-forecast';

import normalizedWeatherForecastResponseFixture from '#/data/fixtures/normalized_weather_forecast_response.json';
import weatherForecastResponseFixture from '#/data/fixtures/weather_forecast_response.json';
import {
	mockedHttpClient,
	type MockedHttpClient,
} from '#/data/mocks/http-client';
import { makeInMemoCacheProvider } from '#/impl/in-memo/providers/cache';

type SUT = {
	cacheProvider: ICacheProvider;
	httpClient: MockedHttpClient;
	sut: WeatherForecastClient;
};

function makeSUT(): SUT {
	const cacheProvider = makeInMemoCacheProvider();
	const httpClient = mockedHttpClient;

	return {
		cacheProvider,
		httpClient,
		sut: new WeatherForecastClient({
			apiKey: 'random_api_key',
			cacheProvider,
			httpClient,
		}),
	};
}

describe('WeatherForecastClient', () => {
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
			value:
				normalizedWeatherForecastResponseFixture as NormalizedWeatherForecast,
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
		deepStrictEqual(httpClient.get.mock.calls[0]!.result, null);
	});

	it('should return a normalized weather forecast and add its value to cache', async () => {
		httpClient.get.mock.mockImplementationOnce(
			() => weatherForecastResponseFixture,
		);

		const coordinates: Coordinates = {
			lat: -22.8833282,
			lng: -47.1964317225214,
		};

		const normalizedWeatherForecast =
			await sut.getWeatherForecastByCoordinates(coordinates);

		const cachedData = await cacheProvider.get(
			sut.getWeatherForecastCacheKey(coordinates),
		);

		deepStrictEqual(
			normalizedWeatherForecast,
			normalizedWeatherForecastResponseFixture,
		);
		deepStrictEqual(cachedData, normalizedWeatherForecast);
		strictEqual(httpClient.get.mock.callCount(), 1);
	});
});
