import { MarketplaceKind, MarketplaceMocks } from '@0xsequence/marketplace-api';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';

const { mockCheckoutOptions, mockMarketplaceEndpoint } = MarketplaceMocks;

import type { UseMarketCheckoutOptionsParams } from './market-checkout-options';
import { useMarketCheckoutOptions } from './market-checkout-options';

// Mock wagmi useAccount hook
vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(),
	};
});

const mockUseAccount = vi.mocked(useAccount);

describe('useMarketCheckoutOptions', () => {
	const defaultArgs: UseMarketCheckoutOptionsParams = {
		chainId: 1,
		orders: [
			{
				collectionAddress: zeroAddress,
				orderId: '123',
				marketplace: MarketplaceKind.sequence_marketplace_v2,
			},
		],
		additionalFee: 0,
		query: {},
	};

	beforeEach(() => {
		mockUseAccount.mockReturnValue({
			address: zeroAddress,
		} as unknown as ReturnType<typeof useAccount>);
	});

	it('should fetch checkout options successfully', async () => {
		const { result } = renderHook(() => useMarketCheckoutOptions(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockCheckoutOptions);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('CheckoutOptionsMarketplace'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch checkout options' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useMarketCheckoutOptions(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useMarketCheckoutOptions(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const firstOrder = defaultArgs.orders?.[0];
		if (!firstOrder) throw new Error('Expected defaultArgs.orders to exist');

		const newArgs = {
			...defaultArgs,
			orders: [
				{
					...firstOrder,
					orderId: '456',
				},
			],
		};

		rerender(() => useMarketCheckoutOptions(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle disabled query when wallet not connected', async () => {
		// Mock wallet not connected
		mockUseAccount.mockReturnValue({
			address: undefined,
		} as unknown as ReturnType<typeof useAccount>);

		const { result } = renderHook(() => useMarketCheckoutOptions(defaultArgs));

		// Should not make request when wallet not connected
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle multiple orders', async () => {
		const multiOrderArgs: UseMarketCheckoutOptionsParams = {
			chainId: 137,
			orders: [
				{
					collectionAddress: zeroAddress,
					orderId: '123',
					marketplace: MarketplaceKind.sequence_marketplace_v2,
				},
				{
					collectionAddress:
						'0x1234567890123456789012345678901234567890' as `0x${string}`,
					orderId: '456',
					marketplace: MarketplaceKind.opensea,
				},
			],
			additionalFee: 100,
			query: {},
		};

		const { result } = renderHook(() =>
			useMarketCheckoutOptions(multiOrderArgs),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});
});
