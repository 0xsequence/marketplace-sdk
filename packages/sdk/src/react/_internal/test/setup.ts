import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers as marketplaceHandlers } from '../api/__mocks__/marketplace.msw';
import { handlers as metadataHandlers } from '../api/__mocks__/metadata.msw';
import { handlers as indexerHandlers } from '../api/__mocks__/indexer.msw';

export const server = setupServer(
	...marketplaceHandlers,
	...metadataHandlers,
	...indexerHandlers,
);

beforeAll(() => {
	server.listen();
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => {
	server.close();
});
