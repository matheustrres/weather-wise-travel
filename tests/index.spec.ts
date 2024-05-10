import { strictEqual } from 'node:assert';
import { it } from 'node:test';

it('should be true', () => {
	const sum = 1 + 1;

	strictEqual(sum == 2, true);
});
