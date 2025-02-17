import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers as marketplaceHandlers } from '../api/__mocks__/marketplace.msw';
import { handlers as metadataHandlers } from '../api/__mocks__/metadata.msw';

const server = setupServer(...marketplaceHandlers, ...metadataHandlers);

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
