import { type WeatherForecast } from './types';

import { type IWeatherClient } from '@/core/ports/clients/weather';
import { type ICacheProvider } from '@/core/ports/providers/cache';
import { type Coordinates, type NormalizedForecast } from '@/core/types';
import { HttpClient, type IHttpClient } from '@/shared/utils/http-client';

type WeatherClientOptions = {
	apiKey: string;
	cacheProvider: ICacheProvider;
};

type SetForecastInCacheOptions = {
	forecast: NormalizedForecast;
	ttlInSeconds: string;
};

const THREE_HOURS_IN_SECONDS = 10_800;

export class VisualCrossingWeatherClient implements IWeatherClient {
	static readonly #CACHE_TTL = THREE_HOURS_IN_SECONDS.toString();

	readonly #apiKey: string;

	readonly #httpClient: IHttpClient;
	readonly #cacheProvider: ICacheProvider;

	static #validate({ apiKey, cacheProvider }: WeatherClientOptions) {
		if (!apiKey || typeof apiKey !== 'string') {
			throw new TypeError(
				'Argument {apiKey} is required and must be a string.',
			);
		}

		if (!cacheProvider) {
			throw new TypeError(
				'Argument {cacheProvider} is required and must implement ICacheProvider.',
			);
		}
	}

	constructor(weatherClientOptions: WeatherClientOptions) {
		VisualCrossingWeatherClient.#validate(weatherClientOptions);

		this.#apiKey = weatherClientOptions.apiKey;
		this.#cacheProvider = weatherClientOptions.cacheProvider;

		this.#httpClient = new HttpClient(
			'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services',
		);
	}

	async getForecastByCoordinates(
		coordinates: Coordinates,
	): Promise<NormalizedForecast> {
		const cachedForecast = await this.#getForecastFromCache(coordinates);

		if (cachedForecast) return cachedForecast;

		const normalizedForecast: NormalizedForecast =
			await this.#getForecastFromAPI(coordinates);

		await this.#setForecastInCache({
			forecast: normalizedForecast,
			ttlInSeconds: VisualCrossingWeatherClient.#CACHE_TTL,
		});

		return normalizedForecast;
	}

	async #getForecastFromAPI({
		lat,
		lng,
	}: Coordinates): Promise<NormalizedForecast> {
		try {
			const endpoint = `timeline/${lat},${lng}?key=${this.#apiKey}`;

			const normalizedForecast =
				await this.#httpClient.get<WeatherForecast>(endpoint);

			return this.#normalizeForecast(normalizedForecast);
		} catch (error) {
			throw new Error((error as Error).message);
		}
	}

	async #getForecastFromCache(
		coordinates: Coordinates,
	): Promise<NormalizedForecast | null> {
		return this.#cacheProvider.get<NormalizedForecast>(
			this.#getCoordsCacheKey(coordinates),
		);
	}

	async #setForecastInCache({
		forecast,
		ttlInSeconds,
	}: SetForecastInCacheOptions): Promise<void> {
		const coordsCacheKey = this.#getCoordsCacheKey({
			lat: forecast.lat,
			lng: forecast.lng,
		});

		await this.#cacheProvider.set<NormalizedForecast>({
			key: coordsCacheKey,
			value: forecast,
			ttlInSeconds,
		});
	}

	#getCoordsCacheKey({ lat, lng }: Coordinates): string {
		return `forecast/${lat}-${lng}`;
	}

	#normalizeForecast(forecast: WeatherForecast): NormalizedForecast {
		return {
			lat: forecast.latitude,
			lng: forecast.longitude,
			timezone: forecast.timezone,
			description: forecast.description,
			days: forecast.days.map((day) => ({
				dateTime: day.datetime,
				conditions: day.conditions,
				description: day.description,
				sunRise: day.sunrise,
				sunSet: day.sunset,
				temperature: {
					min: day.tempmin,
					max: day.tempmax,
					current: day.temp,
				},
				thermalSensation: {
					min: day.feelslikemin,
					max: day.feelslikemax,
					current: day.feelslike,
				},
				pressure: day.pressure,
				cloudCover: day.cloudcover,
				visibility: day.visibility,
				humidity: day.humidity,
				solarRadiation: day.solarradiation,
				solarEnergy: day.solarenergy,
				ultraVioletExposure: day.uvindex,
				dewPointTemperature: day.dew,
				precipitation: {
					current: day.precip,
					probability: day.precipprob,
					cover: day.precipcover,
					types: day.preciptype,
				},
				snow: day.snow,
				snowDepth: day.snowdepth,
				wind: {
					speed: day.windspeed,
					gust: day.windgust,
					direction: day.winddir,
				},
				hours: day.hours.map((hour) => ({
					dateTime: hour.datetime,
					conditions: hour.conditions,
					temperature: hour.temp,
					thermalSensation: hour.feelslike,
					pressure: hour.pressure,
					cloudCover: hour.cloudcover,
					visibility: hour.visibility,
					humidity: hour.humidity,
					solarRadiation: hour.solarradiation,
					solarEnergy: hour.solarenergy,
					ultraVioletExposure: hour.uvindex,
					dewPointTemperature: hour.dew,
					precipitation: {
						current: day.precip,
						probability: day.precipprob,
						cover: 0.0,
						types: day.preciptype,
					},
					snow: hour.snow,
					snowDepth: hour.snowdepth,
					wind: {
						speed: hour.windspeed,
						gust: hour.windgust,
						direction: hour.winddir,
					},
				})),
			})),
		};
	}
}
