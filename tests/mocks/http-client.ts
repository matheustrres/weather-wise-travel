import { type Mock, mock } from 'node:test';

import { type IHttpClient } from '@/shared/utils/http-client';

export type MockedHttpClient = {
	get: Mock<IHttpClient['get']>;
	post: Mock<IHttpClient['post']>;
};

export const mockedHttpClient: MockedHttpClient = {
	get: mock.fn(),
	post: mock.fn(),
};
