import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { createServer } from 'prool';
import { anvil } from 'prool/instances';
import { server } from './test-utils';

// https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scrollIntoView = () => {};

const anvilServer = createServer({
	instance: anvil(),
});

beforeAll(async () => {
	server.listen({
		onUnhandledRequest: 'error',
	});
	await anvilServer.start();
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => {
	server.close();
});
