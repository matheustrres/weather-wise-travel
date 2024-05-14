import { resolve } from 'node:path';

import { addAlias } from 'module-alias';

addAlias(
	'@/',
	resolve(
		(process.env['NODE_ENV'] as string) === 'development' ? 'dist' : 'src',
	),
);
