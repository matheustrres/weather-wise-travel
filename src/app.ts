import express from 'express';

import { Controller } from './core/contracts/controller';
import { Logger } from './shared/utils/logger';

type AppOptions = {
	controllers: Controller[];
	port: number;
	middlewares?: any[];
};

export class App {
	#app!: express.Application;
	#port!: number;
	#logger: Logger;

	static validate({ controllers, port }: AppOptions) {
		if (!controllers.length || !Array.isArray(controllers)) {
			throw new TypeError('Argument {controllers} must be an array.');
		}

		if (
			controllers.every((controller) => !(controller instanceof Controller))
		) {
			throw new TypeError('Argument {controller} must be a Controller.');
		}

		if (!port || typeof port !== 'number') {
			throw new TypeError('Argument {port} is required and must be a number.');
		}
	}

	constructor(options: AppOptions) {
		App.validate(options);

		this.#initApp(options);

		this.#logger = new Logger('App');
	}

	#initApp({ controllers, port }: AppOptions) {
		this.#app = express();
		this.#port = port;

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

	listen() {
		this.#app.listen(this.#port, () => {
			this.#logger.info(`App listening on port [${this.#port}].`);
		});
	}
}
