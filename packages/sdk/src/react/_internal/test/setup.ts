import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
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
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => {
	server.close();
});
