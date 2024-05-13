import { deepStrictEqual, strictEqual } from 'node:assert';
import { afterEach, describe, it } from 'node:test';

import { type ICacheProvider } from '@/core/ports/providers/cache';
import { type Coordinates } from '@/core/types';

import { GeocodingClient } from '@/infra/adapters/clients/geocoding';

import geocodingAddressesResponseFixture from '#/data/fixtures/geocoding_addresses_response.json';
import {
	type MockedHttpClient,
	mockedHttpClient,
} from '#/data/mocks/http-client';
import { makeInMemoCacheProvider } from '#/impl/in-memo/providers/cache';

type SUT = {
	cacheProvider: ICacheProvider;
	httpClient: MockedHttpClient;
	sut: GeocodingClient;
};

function makeSUT(): SUT {
	const cacheProvider = makeInMemoCacheProvider();
	const httpClient = mockedHttpClient;

	return {
		cacheProvider,
		httpClient,
		sut: new GeocodingClient({
			apiKey: 'random_api_key',
			cacheProvider,
			httpClient,
		}),
	};
}

describe('GeocodingClient', () => {
	const { cacheProvider, httpClient, sut } = makeSUT();

	afterEach(() => {
		httpClient.get.mock.resetCalls();
		cacheProvider.flush();
	});

	it('should return a normalized cached geocoding address', async () => {
		const address = 'Park Shopping';
		const cacheKey = sut.getGeocodingAddressCacheKey(address);

		await cacheProvider.set<Coordinates>({
			key: cacheKey,
			value: {
				lat: -12.5515039,
				lng: -55.72023595614893,
			},
		});

		const geocodingAddress = await sut.forwardGeocodingAddress(address);

		const normalizedCachedGeocodingAddress = await cacheProvider.get(cacheKey);

		deepStrictEqual(geocodingAddress, {
			lat: -12.5515039,
			lng: -55.72023595614893,
		});
		deepStrictEqual(geocodingAddress, normalizedCachedGeocodingAddress);
		strictEqual(httpClient.get.mock.callCount(), 0);
	});

	it('should return null if no geocoding address is found for given address', async () => {
		httpClient.get.mock.mockImplementationOnce(() => null);

		const geocodingAddress =
			await sut.forwardGeocodingAddress('Général Leclerc');

		deepStrictEqual(geocodingAddress, null);
		strictEqual(httpClient.get.mock.callCount(), 1);
		deepStrictEqual(httpClient.get.mock.calls[0]!.result, null);
	});

	it('should return a normalized geocoding address and add its value to cache', async () => {
		httpClient.get.mock.mockImplementationOnce(
			() => geocodingAddressesResponseFixture,
		);

		const address = 'Rue des Boulets';

		const normalizedGeocodingAddress =
			await sut.forwardGeocodingAddress(address);

		const cachedData = await cacheProvider.get(
			sut.getGeocodingAddressCacheKey(address),
		);

		deepStrictEqual(normalizedGeocodingAddress, {
			lat: Number(geocodingAddressesResponseFixture[0]!.lat),
			lng: Number(geocodingAddressesResponseFixture[0]!.lon),
		});
		deepStrictEqual(cachedData, normalizedGeocodingAddress);
		strictEqual(httpClient.get.mock.callCount(), 1);
		deepStrictEqual(
			httpClient.get.mock.calls[0]!.result,
			geocodingAddressesResponseFixture,
		);
	});
});
