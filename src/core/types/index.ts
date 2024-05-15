export type Coordinates = {
	lat: number;
	lng: number;
};

export type NormalizedWeatherForecastTimeline = {
	lat: number;
	lng: number;
	timezone: string;
	description: string;
	days: NormalizedWeatherForecastTimelineDay[];
};

type NormalizedWeatherForecastTimelineDay = {
	dateTime: string;
	conditions: string;
	description: string;
	sunRise: string;
	sunSet: string;
	temperature: NormalizedWeatherForecastTimelineTemperature;
	thermalSensation: NormalizedWeatherForecastTimelineThermalSensation;
	pressure: number;
	cloudCover: number;
	visibility: number;
	humidity: number;
	solarRadiation: number;
	solarEnergy: number;
	ultraVioletExposure: number;
	dewPointTemperature: number;
	precipitation: NormalizedWeatherForecastTimelinePrecipitation;
	snow: number;
	snowDepth: number;
	wind: NormalizedWeatherForecastTimelineWind;
	hours: NormalizedWeatherForecastTimelineHour[];
};

type NormalizedWeatherForecastTimelineTemperature = {
	min: number;
	max: number;
	current: number;
};

type NormalizedWeatherForecastTimelineThermalSensation = {
	min: number;
	max: number;
	current: number;
};

type NormalizedWeatherForecastTimelinePrecipitation = {
	current: number;
	probability: number;
	cover: number;
	types?: string[];
};

type NormalizedWeatherForecastTimelineWind = {
	speed: number;
	gust: number;
	direction: number;
};

type NormalizedWeatherForecastTimelineHour = {
	dateTime: string;
	conditions: string;
	temperature: number;
	thermalSensation: number;
	pressure: number;
	cloudCover: number;
	visibility: number;
	humidity: number;
	solarRadiation: number;
	solarEnergy: number;
	ultraVioletExposure: number;
	dewPointTemperature: number;
	precipitation: NormalizedWeatherForecastTimelinePrecipitation;
	snow: number;
	snowDepth: number;
	wind: NormalizedWeatherForecastTimelineWind;
};
