export type Coordinates = {
	lat: number;
	lng: number;
};

export type NormalizedWeatherForecast = {
	lat: number;
	lng: number;
	timezone: string;
	description: string;
	days: Day[];
};

type Day = {
	dateTime: string;
	conditions: string;
	description: string;
	sunRise: string;
	sunSet: string;
	temperature: Temperature;
	thermalSensation: ThermalSensation;
	pressure: number;
	cloudCover: number;
	visibility: number;
	humidity: number;
	solarRadiation: number;
	solarEnergy: number;
	ultraVioletExposure: number;
	dewPointTemperature: number;
	precipitation: Precipitation;
	snow: number;
	snowDepth: number;
	wind: Wind;
	hours: Hour[];
};

type Temperature = {
	min: number;
	max: number;
	current: number;
};

type ThermalSensation = {
	min: number;
	max: number;
	current: number;
};

type Precipitation = {
	current: number;
	probability: number;
	cover: number;
	types?: string[];
};

type Wind = {
	speed: number;
	gust: number;
	direction: number;
};

type Hour = {
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
	precipitation: Precipitation;
	snow: number;
	snowDepth: number;
	wind: Wind;
};
