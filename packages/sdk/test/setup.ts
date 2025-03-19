import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { server } from './test-utils';

// https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scrollIntoView = () => {};

beforeAll(async () => {
	server.listen({
		onUnhandledRequest(request, print) {
			// Ignore requests to the local anvil node
			if (request.url.includes('127.0.0.1:8545')) {
				return;
			}
			print.warning();
		},
	});
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => {
	server.close();
});
