import { type GeocodingAddress } from './types';

import {
	ClientAdapter,
	type CommonClientAdapterOptions,
} from '../client-adapter';

import { type IGeocodingClient } from '@/core/ports/clients/geocoding';
import { type Coordinates } from '@/core/types';

import { generateQueryParams } from '@/shared/utils/funcs/gen-query-params';
import { HttpClient, type IHttpClient } from '@/shared/utils/http-client';

type GeocodingClientOptions = CommonClientAdapterOptions & {
	httpClient?: IHttpClient;
};

export class GeocodingClient extends ClientAdapter implements IGeocodingClient {
	static readonly #TTL_SEVENTY_TWO_HOURS_IN_SECONDS = 259_200;

	constructor({ apiKey, cacheProvider, httpClient }: GeocodingClientOptions) {
		super({
			apiKey,
			cacheProvider,
			httpClient: httpClient || new HttpClient('https://geocode.maps.co'),
		});
	}

	async forwardGeocodingAddress(address: string): Promise<Coordinates | null> {
		const geocodingAddressCacheKey = this.getGeocodingAddressCacheKey(address);

		const normalizedCachedGeocodingAddress =
			await this._fetchDataFromCache<Coordinates>(geocodingAddressCacheKey);

		if (normalizedCachedGeocodingAddress)
			return normalizedCachedGeocodingAddress;

		const endpoint = this.#getEndpoint({
			q: address,
			api_key: this._apiKey,
		});

		const geocodingAddresses =
			await this._fetchDataFromAPI<GeocodingAddress[]>(endpoint);

		if (!geocodingAddresses.length) return null;

		const normalizedGeocodingAddress = this.#normalizeGeocodingAddress(
			geocodingAddresses[0]!,
		);

		await this._setDataInCache({
			key: geocodingAddressCacheKey,
			ttlInSeconds:
				GeocodingClient.#TTL_SEVENTY_TWO_HOURS_IN_SECONDS.toString(),
			value: normalizedGeocodingAddress,
		});

		return normalizedGeocodingAddress;
	}

	getGeocodingAddressCacheKey(address: string) {
		return `geocoding/address:${encodeURIComponent(address)
			.replace(/\s+/g, '_')
			.toLowerCase()}`;
	}

	#getEndpoint({ api_key, q }: GeocodingQueryParams) {
		const params = generateQueryParams<GeocodingQueryParams>({
			q: encodeURIComponent(q),
			api_key,
		});

		return `search?${params}`;
	}

	#normalizeGeocodingAddress(geocodingAddress: GeocodingAddress): Coordinates {
		console.log({ geocodingAddress });
		return {
			lat: Number(geocodingAddress.lat),
			lng: Number(geocodingAddress.lon),
		};
	}
}

type GeocodingQueryParams = {
	api_key: string;
	q: string;
};
