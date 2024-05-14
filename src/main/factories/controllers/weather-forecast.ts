import { WeatherForecastController } from '@/infra/http/controllers/weather-forecast';

import { makeWeatherForecastUseCase } from '@/main/factories/use-cases/weather-forecast';

export function makeWeatherForecastController() {
	return new WeatherForecastController(makeWeatherForecastUseCase());
}
