import './shared/utils/alias';

import http from 'node:http';

import { App } from './app';

import { makeGetAddressWeatherForecastTimelineController } from '@/main/factories/controllers/forecast-timeline';

import { Logger } from '@/shared/utils/logger';

const logger = new Logger('Server');

(() => {
	const app = new App({
		controllers: [makeGetAddressWeatherForecastTimelineController()],
	});

	const httpServer = http.createServer(app.getInstance());

	httpServer.listen(3000, () => {
		logger.info(`Server listening on port 3000.`);
	});
})();
