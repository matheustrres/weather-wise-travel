import { type UseCase } from '@/core/contracts/use-case';
import { type IGeocodingClient } from '@/core/ports/clients/geocoding';
import { type IWeatherForecastClient } from '@/core/ports/clients/weather-forecast';
import { type NormalizedWeatherForecast } from '@/core/types';

type WeatherForecastUseCaseInput = {
	address: string;
};

type WeatherForecastUseCaseOutput = {
	forecast: NormalizedWeatherForecast;
};

export class WeatherForecastUseCase
	implements UseCase<WeatherForecastUseCaseInput, WeatherForecastUseCaseOutput>
{
	constructor(
		private readonly geocodingClient: IGeocodingClient,
		private readonly weatherForecastClient: IWeatherForecastClient,
	) {}

	async exec({
		address,
	}: WeatherForecastUseCaseInput): Promise<WeatherForecastUseCaseOutput> {
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
