import { type Coordinates } from '@/core/types';

export interface IGeocodingClient {
	forwardGeocodingAddress(address: string): Promise<Coordinates | null>;
}
