import { type Request, type Response } from 'express';

import { type GetAddressWeatherForecastTimelineUseCase } from '@/appl/use-cases/forecast-timeline';

import { Controller } from '@/core/contracts/controller';

export class GetAddressWeatherForecastTimelineController extends Controller {
	prefix = '/forecast/timeline';

	constructor(
		private readonly getAddressWeatherForecastTimelineUseCase: GetAddressWeatherForecastTimelineUseCase,
	) {
		super();

		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(this.prefix, this.handle);
	}

	/**
	 * Using arrow functions to avoid having to bind the lexical context (this)
	 */
	handle = async (req: Request, res: Response): Promise<Response> => {
		const address = req.query['address'] as string;

		const { timeline } =
			await this.getAddressWeatherForecastTimelineUseCase.exec({ address });

		return res.status(200).json(timeline);
	};
}
