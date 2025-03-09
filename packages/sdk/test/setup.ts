import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';
import { createServer } from 'prool';
import { anvil } from 'prool/instances';
import { handlers as indexerHandlers } from '../src/react/_internal/api/__mocks__/indexer.msw';
import { handlers as marketplaceHandlers } from '../src/react/_internal/api/__mocks__/marketplace.msw';
import { handlers as metadataHandlers } from '../src/react/_internal/api/__mocks__/metadata.msw';
import { handlers as marketplaceConfigHandlers } from '../src/react/hooks/options/__mocks__/marketplaceConfig.msw';

export const server = setupServer(
	...marketplaceHandlers,
	...metadataHandlers,
	...indexerHandlers,
	...marketplaceConfigHandlers,
);

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
