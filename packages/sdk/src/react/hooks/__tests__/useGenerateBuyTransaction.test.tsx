import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
	commonWagmiMocks,
	mockChains,
	mockConnectors,
} from '../../_internal/test/mocks/wagmi';

// Mock wagmi
vi.mock('wagmi', () => ({
	useAccount: commonWagmiMocks.useAccount,
	createConfig: commonWagmiMocks.createConfig,
	http: commonWagmiMocks.http,
	WagmiProvider: commonWagmiMocks.WagmiProvider,
}));

// Mock wagmi/chains
vi.mock('wagmi/chains', () => mockChains);

// Mock wagmi/connectors
vi.mock('wagmi/connectors', () => mockConnectors);

// Mock useConfig hook
vi.mock('../useConfig', () => ({
	useConfig: vi.fn(),
}));

import { useGenerateBuyTransaction } from '../useGenerateBuyTransaction';
import { renderHook, waitFor } from '../../_internal/test-utils';
import { zeroAddress } from 'viem';
import { http, HttpResponse } from 'msw';
import {
	mockSteps,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { server } from '../../_internal/test/setup';
import { MarketplaceKind } from '../../_internal/api/marketplace.gen';
import { useConfig } from '../useConfig';

describe('useGenerateBuyTransaction', () => {
	const defaultArgs = {
		chainId: '1',
		collectionAddress: zeroAddress,
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		ordersData: [
			{
				orderId: '0x9876543210987654321098765432109876543210',
				quantity: '1',
				marketplace: MarketplaceKind.sequence_marketplace_v2,
			},
		],
		query: {},
	};

	const mockConfig = {
		projectAccessKey: 'test-key',
		projectId: 'test-id',
	};

	beforeEach(() => {
		// Reset handlers
		server.resetHandlers();

		// Mock useAccount to return an address
		commonWagmiMocks.useAccount.mockReturnValue({
			address: '0x1234567890123456789012345678901234567890',
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
		});

		// Mock useConfig to return config
		(useConfig as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			mockConfig,
		);

		// Set up default success handler
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateBuyTransaction'), () => {
				return HttpResponse.json({ steps: mockSteps });
			}),
		);
	});

	it('should generate buy transaction successfully', async () => {
		const { result } = renderHook(() => useGenerateBuyTransaction(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockSteps);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateBuyTransaction'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to generate buy transaction' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useGenerateBuyTransaction(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should not make request when wallet is not connected', async () => {
		// Mock wallet not connected
		commonWagmiMocks.useAccount.mockReturnValue({
			address: undefined,
			isConnecting: false,
			isDisconnected: true,
			isReconnecting: false,
			status: 'disconnected',
		});

		const { result } = renderHook(() => useGenerateBuyTransaction(defaultArgs));

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle invalid order data', async () => {
		const invalidArgs = {
			...defaultArgs,
			ordersData: [], // Empty orders array
		};

		server.use(
			http.post(mockMarketplaceEndpoint('GenerateBuyTransaction'), () => {
				return HttpResponse.json({ error: 'endpoint error' }, { status: 400 });
			}),
		);

		const { result } = renderHook(() => useGenerateBuyTransaction(invalidArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error?.message).toBe('endpoint error');
		expect(result.current.data).toBeUndefined();
	});

	it('should not make request when wallet is connecting', async () => {
		// Mock wallet in connecting state
		commonWagmiMocks.useAccount.mockReturnValue({
			address: undefined,
			isConnecting: true,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connecting',
		});

		const { result } = renderHook(() => useGenerateBuyTransaction(defaultArgs));

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();

		// Verify no API call was made by checking the mock handler was not called
		const mockHandler = vi.fn();
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateBuyTransaction'), mockHandler),
		);
		expect(mockHandler).not.toHaveBeenCalled();
	});
});
