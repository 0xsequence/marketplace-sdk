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

import { useGenerateCancelTransaction } from '../useGenerateCancelTransaction';
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
import { act } from '@testing-library/react';

describe('useGenerateCancelTransaction', () => {
	const defaultArgs = {
		chainId: '1',
		orderId: '0x9876543210987654321098765432109876543210',
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		collectionAddress: zeroAddress,
		maker: '0x1234567890123456789012345678901234567890',
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
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({ steps: mockSteps });
			}),
		);
	});

	it('should generate cancel transaction successfully', async () => {
		const { result } = renderHook(() =>
			useGenerateCancelTransaction(defaultArgs),
		);

		await act(async () => {
			await result.current.generateCancelTransactionAsync(defaultArgs);
		});

		await waitFor(() => {
			expect(result.current.data).toEqual(mockSteps);
		});
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to generate cancel transaction' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useGenerateCancelTransaction(defaultArgs),
		);

		await act(async () => {
			try {
				await result.current.generateCancelTransactionAsync(defaultArgs);
			} catch (error) {
				// Expected error
			}
		});

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
		expect(result.current.error).toBeDefined();
	});

	it('should not make request when wallet is not connected', async () => {
		commonWagmiMocks.useAccount.mockReturnValue({
			address: undefined,
			isConnecting: false,
			isDisconnected: true,
			isReconnecting: false,
			status: 'disconnected',
		});

		const { result } = renderHook(() =>
			useGenerateCancelTransaction(defaultArgs),
		);

		expect(result.current.isPending).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle invalid order data', async () => {
		const invalidArgs = {
			...defaultArgs,
			orderId: '', // Invalid order ID
		};

		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({ error: 'endpoint error' }, { status: 400 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateCancelTransaction(invalidArgs),
		);

		await act(async () => {
			try {
				await result.current.generateCancelTransactionAsync(invalidArgs);
			} catch (error) {
				// Expected error
			}
		});

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
		expect(result.current.error?.message).toBe('endpoint error');
	});

	it('should not make request when wallet is connecting', async () => {
		commonWagmiMocks.useAccount.mockReturnValue({
			address: undefined,
			isConnecting: true,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connecting',
		});

		const { result } = renderHook(() =>
			useGenerateCancelTransaction(defaultArgs),
		);

		expect(result.current.isPending).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should call onSuccess callback when provided', async () => {
		const onSuccess = vi.fn();
		const { result } = renderHook(() =>
			useGenerateCancelTransaction({ ...defaultArgs, onSuccess }),
		);

		await act(async () => {
			await result.current.generateCancelTransactionAsync(defaultArgs);
		});

		await waitFor(() => {
			expect(onSuccess).toHaveBeenCalledWith(
				[mockSteps[0]],
				defaultArgs,
				undefined,
			);
		});
	});
});
