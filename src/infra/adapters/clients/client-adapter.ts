import { type ICacheProvider } from '@/core/ports/providers/cache';

import { type IHttpClient } from '@/shared/utils/http-client';

export type CommonClientAdapterOptions = {
	apiKey: string;
	cacheProvider: ICacheProvider;
};

type ClientAdapterOptions = CommonClientAdapterOptions & {
	httpClient: IHttpClient;
};

type SetDataInCacheOptions<T> = {
	key: string;
	ttlInSeconds: string;
	value: T;
};

export abstract class ClientAdapter {
	protected readonly _apiKey: string;
	protected readonly _cacheProvider: ICacheProvider;
	protected readonly _httpClient: IHttpClient;

	static #validate({
		apiKey,
		cacheProvider,
		httpClient,
	}: ClientAdapterOptions) {
		if (!apiKey || typeof apiKey !== 'string') {
			throw new TypeError(
				'Argument {apiKey} is required and must be a string.',
			);
		}

		if (!cacheProvider) {
			throw new TypeError('Argument {cacheProvider} is required.');
		}

		if (!httpClient) {
			throw new TypeError('Argument {httpClient} is required.');
		}
	}

	constructor(options: ClientAdapterOptions) {
		ClientAdapter.#validate(options);

		this._apiKey = options.apiKey;
		this._cacheProvider = options.cacheProvider;
		this._httpClient = options.httpClient;
	}

	protected async _fetchDataFromAPI<T>(endpoint: string): Promise<T> {
		try {
			return this._httpClient.get<T>(endpoint);
		} catch (error) {
			throw new Error((error as Error).message);
		}
	}

	protected async _fetchDataFromCache<T>(key: string): Promise<T | null> {
		return this._cacheProvider.get(key);
	}

	protected async _setDataInCache<T>(options: SetDataInCacheOptions<T>) {
		await this._cacheProvider.set<T>(options);
	}
}
