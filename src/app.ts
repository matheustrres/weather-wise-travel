import express from 'express';

import { Controller } from '@/core/contracts/controller';

type AppOptions = {
	controllers: Controller[];
	middlewares?: any[];
};

export class App {
	#app!: express.Application;

	static validate({ controllers }: AppOptions) {
		if (!controllers.length || !Array.isArray(controllers)) {
			throw new TypeError('Argument {controllers} must be an array.');
		}

		if (
			controllers.every((controller) => !(controller instanceof Controller))
		) {
			throw new TypeError('Argument {controller} must be a Controller.');
		}
	}

	constructor(options: AppOptions) {
		App.validate(options);

		this.#initApp(options);
	}

	#initApp({ controllers }: AppOptions) {
		this.#app = express();

		this.#initMiddlewares();
		this.#initControllers(controllers);
	}

	#initMiddlewares() {
		this.#app.use(express.json());
	}

	#initControllers(controllers: Controller[]): void {
		controllers.forEach((controller) => {
			this.#app.use('/api/v1', controller.router);
		});
	}

	getInstance() {
		return this.#app;
	}
}
