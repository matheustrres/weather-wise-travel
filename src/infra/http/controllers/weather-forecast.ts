import { type Request, type Response } from 'express';

import { type WeatherForecastUseCase } from '@/appl/use-cases/weather-forecast';

import { Controller } from '@/core/contracts/controller';

export class WeatherForecastController extends Controller {
	prefix = '/forecast';

	constructor(private readonly weatherForecastUseCase: WeatherForecastUseCase) {
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

		const { forecast } = await this.weatherForecastUseCase.exec({ address });

		return res.status(200).json(forecast);
	};
}
