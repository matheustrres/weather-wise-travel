import { type WeatherForecast } from './types';

import {
	ClientAdapter,
	type CommonClientAdapterOptions,
} from '../client-adapter';

import { type IWeatherClient } from '@/core/ports/clients/weather';
import { type Coordinates, type NormalizedWeatherForecast } from '@/core/types';

import { HttpClient, type IHttpClient } from '@/shared/utils/http-client';

type WeatherClientOptions = CommonClientAdapterOptions & {
	httpClient?: IHttpClient;
};

export class WeatherClient extends ClientAdapter implements IWeatherClient {
	static readonly #TTL_THREE_HOURS_IN_SECONDS = 10_800;

	constructor({ apiKey, cacheProvider, httpClient }: WeatherClientOptions) {
		super({
			apiKey,
			cacheProvider,
			httpClient:
				httpClient ||
				new HttpClient(
					'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services',
				),
		});
	}

	async getWeatherForecastByCoordinates(
		coordinates: Coordinates,
	): Promise<NormalizedWeatherForecast | null> {
		const weatherForecastCacheKey =
			this.#getWeatherForecastCacheKey(coordinates);

		const normalizedCachedWeatherForecast =
			await this._fetchDataFromCache<NormalizedWeatherForecast>(
				weatherForecastCacheKey,
			);

		if (normalizedCachedWeatherForecast) {
			return normalizedCachedWeatherForecast;
		}

		const weatherForecast = await this._fetchDataFromAPI<WeatherForecast>(
			this.#getEndpoint(coordinates),
		);

		if (!weatherForecast) return null;

		const normalizedWeatherForecast =
			this.#normalizeWeatherForecast(weatherForecast);

		await this._setDataInCache({
			key: weatherForecastCacheKey,
			ttlInSeconds: WeatherClient.#TTL_THREE_HOURS_IN_SECONDS.toString(),
			value: normalizedWeatherForecast,
		});

		return normalizedWeatherForecast;
	}

	#getEndpoint({ lat, lng }: Coordinates) {
		return `timeline/${lat},${lng}?key=${this._apiKey}`;
	}

	#getWeatherForecastCacheKey({ lat, lng }: Coordinates): string {
		return `forecast/${lat}-${lng}`;
	}

	#normalizeWeatherForecast(
		weatherForecast: WeatherForecast,
	): NormalizedWeatherForecast {
		return {
			lat: weatherForecast.latitude,
			lng: weatherForecast.longitude,
			timezone: weatherForecast.timezone,
			description: weatherForecast.description,
			days: weatherForecast.days.map((day) => ({
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
