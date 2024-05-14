import './shared/utils/alias';

import http from 'node:http';

import { App } from './app';

import { makeWeatherForecastController } from '@/main/factories/controllers/weather-forecast';

import { Logger } from '@/shared/utils/logger';

const logger = new Logger('Server');

(() => {
	const app = new App({
		controllers: [makeWeatherForecastController()],
	});

	const httpServer = http.createServer(app.getInstance());

	httpServer.listen(3000, () => {
		logger.info(`Server listening on port 3000.`);
	});
})();
