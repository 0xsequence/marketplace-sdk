import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers as marketplaceHandlers } from '../api/__mocks__/marketplace.msw';
import { handlers as metadataHandlers } from '../api/__mocks__/metadata.msw';
import { handlers as indexerHandlers } from '../api/__mocks__/indexer.msw';
import { handlers as marketplaceConfigHandlers } from '../../hooks/options/__mocks__/marketplaceConfig.msw';

export const server = setupServer(
	...marketplaceHandlers,
	...metadataHandlers,
	...indexerHandlers,
	...marketplaceConfigHandlers,
);

beforeAll(() => {
	server.listen();
	server.resetHandlers(
		...marketplaceHandlers,
		...metadataHandlers,
		...indexerHandlers,
		...marketplaceConfigHandlers,
	);
});

afterEach(() => {
	cleanup();
	server.resetHandlers(
		...marketplaceHandlers,
		...metadataHandlers,
		...indexerHandlers,
		...marketplaceConfigHandlers,
	);
});

afterAll(() => {
	server.close();
});
