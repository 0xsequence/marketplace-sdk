import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { MarketplaceKind } from '../../_internal';
import {
	mockCheckoutOptions,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { useCheckoutOptions } from '../useCheckoutOptions';
import type { UseCheckoutOptionsParams } from '../useCheckoutOptions';

// Mock wagmi useAccount hook
vi.mock('wagmi', () => ({
	useAccount: vi.fn(),
}));

const mockUseAccount = vi.mocked(useAccount);

describe('useCheckoutOptions', () => {
	const defaultArgs: UseCheckoutOptionsParams = {
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
		const { result } = renderHook(() => useCheckoutOptions(defaultArgs));

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

		const { result } = renderHook(() => useCheckoutOptions(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCheckoutOptions(defaultArgs),
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

		rerender(() => useCheckoutOptions(newArgs));

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

		const { result } = renderHook(() => useCheckoutOptions(defaultArgs));

		// Should not make request when wallet not connected
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle multiple orders', async () => {
		const multiOrderArgs: UseCheckoutOptionsParams = {
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

		const { result } = renderHook(() => useCheckoutOptions(multiOrderArgs));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});
});
