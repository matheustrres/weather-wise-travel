export type RequestOptions = {
	headers?: HeadersInit;
};

export type PostRequestOptions<Body extends BodyInit> = RequestOptions & {
	body?: Body;
};

export interface IHttpClient {
	get<TResponse>(
		endpoint: string,
		options?: RequestOptions,
	): Promise<TResponse>;
	post<TBody extends BodyInit, TResponse>(
		endpoint: string,
		options: PostRequestOptions<TBody>,
	): Promise<TResponse>;
}

export class HttpClient implements IHttpClient {
	#baseURL: string;

	static #validate(baseURL: string) {
		if (!baseURL || typeof baseURL !== 'string') {
			throw new TypeError(
				'Argument {baseURL} is required and must be a string.',
			);
		}
	}

	constructor(baseURL: string) {
		HttpClient.#validate(baseURL);

		this.#baseURL = baseURL;
	}

	async get<TResponse>(
		endpoint: string,
		options: RequestOptions,
	): Promise<TResponse> {
		return fetch(new URL(`${this.#baseURL}/${endpoint}`), {
			method: 'GET',
			...options,
		}).then((r) => r.json() as Promise<TResponse>);
	}

	async post<TBody extends BodyInit, TResponse>(
		endpoint: string,
		options: PostRequestOptions<TBody>,
	): Promise<TResponse> {
		return fetch(new URL(`${this.#baseURL}/${endpoint}`), {
			method: 'POST',
			...options,
		}).then((r) => r.json() as Promise<TResponse>);
	}
}
