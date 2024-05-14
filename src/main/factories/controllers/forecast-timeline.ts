import { GetAddressWeatherForecastTimelineController } from '@/infra/http/controllers/forecast-timeline';

import { makeGetAddressWeatherForecastTimelineUseCase } from '@/main/factories/use-cases/forecast-timeline';

export function makeGetAddressWeatherForecastTimelineController() {
	return new GetAddressWeatherForecastTimelineController(
		makeGetAddressWeatherForecastTimelineUseCase(),
	);
}
