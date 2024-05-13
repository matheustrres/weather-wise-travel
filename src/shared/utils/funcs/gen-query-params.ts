export function generateQueryParams<Params extends object>(params: Params) {
	return Object.entries(params)
		.filter(([_, value]) => value)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');
}
