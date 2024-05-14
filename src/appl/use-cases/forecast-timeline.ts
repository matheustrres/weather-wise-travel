import { type UseCase } from '@/core/contracts/use-case';
import { type IGeocodingClient } from '@/core/ports/clients/geocoding';
import { type IWeatherForecastClient } from '@/core/ports/clients/weather-forecast';
import { type NormalizedWeatherForecast } from '@/core/types';

type GetAddressWeatherForecastTimelineUseCaseInput = {
	address: string;
};

type GetAddressWeatherForecastTimelineUseCaseOutput = {
	forecast: NormalizedWeatherForecast;
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
		private readonly weatherForecastClient: IWeatherForecastClient,
	) {}

	async exec({
		address,
	}: GetAddressWeatherForecastTimelineUseCaseInput): Promise<GetAddressWeatherForecastTimelineUseCaseOutput> {
		const geocodingAddress =
			await this.geocodingClient.forwardGeocodingAddress(address);

		if (!geocodingAddress) {
			throw new Error('An invalid address were provided.');
		}

		const forecast =
			await this.weatherForecastClient.getWeatherForecastByCoordinates(
				geocodingAddress,
			);

		if (!forecast) {
			throw new Error('No forecast found for given address coordinates.');
		}

		return {
			forecast,
		};
	}
}
