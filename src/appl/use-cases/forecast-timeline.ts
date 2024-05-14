import { type UseCase } from '@/core/contracts/use-case';
import { type IGeocodingClient } from '@/core/ports/clients/geocoding';
import { type IWeatherForecastTimelineClient } from '@/core/ports/clients/weather-forecast';
import { type NormalizedWeatherForecastTimeline } from '@/core/types';

type GetAddressWeatherForecastTimelineUseCaseInput = {
	address: string;
};

type GetAddressWeatherForecastTimelineUseCaseOutput = {
	timeline: NormalizedWeatherForecastTimeline;
};

export class GetAddressWeatherForecastTimelineUseCase
	implements
		UseCase<
			GetAddressWeatherForecastTimelineUseCaseInput,
			GetAddressWeatherForecastTimelineUseCaseOutput
		>
{
	constructor(
		private readonly geocodingClient: IGeocodingClient,
		private readonly weatherForecastTimelineClient: IWeatherForecastTimelineClient,
	) {}

	async exec({
		address,
	}: GetAddressWeatherForecastTimelineUseCaseInput): Promise<GetAddressWeatherForecastTimelineUseCaseOutput> {
		const geocodingAddress =
			await this.geocodingClient.forwardGeocodingAddress(address);

		if (!geocodingAddress) {
			throw new Error('An invalid address were provided.');
		}

		const timeline =
			await this.weatherForecastTimelineClient.getWeatherForecastTimelineByCoordinates(
				geocodingAddress,
			);

		if (!timeline) {
			throw new Error('No forecast timeline were found for given address.');
		}

		return {
			timeline,
		};
	}
}
