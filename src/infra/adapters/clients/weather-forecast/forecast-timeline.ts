import { type WeatherForecastTimeline } from './types';

import {
	ClientAdapter,
	type CommonClientAdapterOptions,
} from '../client-adapter';

import { type IWeatherForecastTimelineClient } from '@/core/ports/clients/weather-forecast';
import {
	type Coordinates,
	type NormalizedWeatherForecastTimeline,
} from '@/core/types';

import { HttpClient, type IHttpClient } from '@/shared/utils/http-client';

type WeatherForecastClientOptions = CommonClientAdapterOptions & {
	httpClient?: IHttpClient;
};

export class WeatherForecastTimelineClient
	extends ClientAdapter
	implements IWeatherForecastTimelineClient
{
	static readonly #TTL_THREE_HOURS_IN_SECONDS = 10_800;

	constructor({
		apiKey,
		cacheProvider,
		httpClient,
	}: WeatherForecastClientOptions) {
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

	async getWeatherForecastTimelineByCoordinates(
		coordinates: Coordinates,
	): Promise<NormalizedWeatherForecastTimeline | null> {
		const weatherForecastTimelineCacheKey =
			this.getWeatherForecastTimelineCacheKey(coordinates);

		const normalizedCachedWeatherForecastTimeline =
			await this._fetchDataFromCache<NormalizedWeatherForecastTimeline>(
				weatherForecastTimelineCacheKey,
			);

		if (normalizedCachedWeatherForecastTimeline) {
			return normalizedCachedWeatherForecastTimeline;
		}

		const weatherForecastTimeline =
			await this._fetchDataFromAPI<WeatherForecastTimeline>(
				this.#getEndpoint(coordinates),
			);

		if (!weatherForecastTimeline) return null;

		const normalizedWeatherForecastTimeline =
			this.#normalizeWeatherForecastTimeline(weatherForecastTimeline);

		await this._setDataInCache<NormalizedWeatherForecastTimeline>({
			key: weatherForecastTimelineCacheKey,
			ttlInSeconds: WeatherForecastTimelineClient.#TTL_THREE_HOURS_IN_SECONDS,
			value: normalizedWeatherForecastTimeline,
		});

		return normalizedWeatherForecastTimeline;
	}

	#getEndpoint({ lat, lng }: Coordinates) {
		return `timeline/${lat},${lng}?key=${this._apiKey}`;
	}

	getWeatherForecastTimelineCacheKey({ lat, lng }: Coordinates): string {
		return `forecast/${lat}-${lng}`;
	}

	#normalizeWeatherForecastTimeline(
		weatherForecastTimeline: WeatherForecastTimeline,
	): NormalizedWeatherForecastTimeline {
		return {
			lat: weatherForecastTimeline.latitude,
			lng: weatherForecastTimeline.longitude,
			timezone: weatherForecastTimeline.timezone,
			description: weatherForecastTimeline.description,
			days: weatherForecastTimeline.days.map((day) => ({
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
