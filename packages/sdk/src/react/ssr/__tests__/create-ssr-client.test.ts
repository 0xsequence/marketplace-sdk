import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SdkConfig } from '../../../types';
import { mockConfig } from '../../hooks/options/__mocks__/marketplaceConfig.msw';
import { createSSRClient } from '../create-ssr-client';

vi.mock('wagmi', () => ({
	cookieToInitialState: vi.fn().mockReturnValue({
		data: { account: { address: '0x123' } },
	}),
}));

describe('createSSRClient', () => {
	let queryClient: QueryClient;
	let config: SdkConfig;

	beforeEach(() => {
		// Reset QueryClient
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		// Setup basic config
		config = {
			projectId: 'test-project',
			projectAccessKey: 'test-key',
			_internal: {
				builderEnv: 'production',
			},
		};
	});

	it('should create SSR client with proper methods', () => {
		const client = createSSRClient({
			cookie: 'test-cookie',
			config,
			queryClient,
		});

		expect(client).toHaveProperty('getInitialState');
		expect(client).toHaveProperty('getMarketplaceConfig');
		expect(client).toHaveProperty('config');
		expect(typeof client.getInitialState).toBe('function');
		expect(typeof client.getMarketplaceConfig).toBe('function');
	});

	it('should fetch marketplace config successfully', async () => {
		const client = createSSRClient({
			cookie: 'test-cookie',
			config,
			queryClient,
		});

		const marketplaceConfig = await client.getMarketplaceConfig();

		expect(marketplaceConfig).toBeDefined();
		expect(marketplaceConfig).toMatchObject({
			publisherId: mockConfig.publisherId,
			title: mockConfig.title,
			collections: expect.arrayContaining([
				expect.objectContaining({
					address: expect.any(String),
					chainId: expect.any(Number),
				}),
			]),
		});
	});

	it('should get initial state with wagmi configuration', async () => {
		const client = createSSRClient({
			cookie: 'test-cookie',
			config,
			queryClient,
		});

		const state = await client.getInitialState();

		expect(state).toHaveProperty('wagmi');
		expect(state.wagmi).toEqual({
			data: { account: { address: '0x123' } },
		});
	});

	it('should preserve provided config in the client', () => {
		const client = createSSRClient({
			cookie: 'test-cookie',
			config,
			queryClient,
		});

		expect(client.config).toEqual(config);
	});
});
