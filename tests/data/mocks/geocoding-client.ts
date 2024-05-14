import { type Mock, mock } from 'node:test';

import { type IGeocodingClient } from '@/core/ports/clients/geocoding';

export type MockedGeocodingClient = {
	forwardGeocodingAddress: Mock<IGeocodingClient['forwardGeocodingAddress']>;
};

export const mockedGeocodingClient: MockedGeocodingClient = {
	forwardGeocodingAddress: mock.fn(),
};
