import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	mockMarketplaceEndpoint,
	mockOrder,
} from '../../_internal/api/__mocks__/marketplace.msw';
import type { UseHighestOfferArgs } from '../useHighestOffer';
import { useHighestOffer } from '../useHighestOffer';

describe('useHighestOffer', () => {
	const defaultArgs: UseHighestOfferArgs = {
		chainId: '1',
		collectionAddress: zeroAddress,
		tokenId: '1',
		query: {},
	};

	it('should fetch highest offer data successfully', async () => {
		const { result } = renderHook(() => useHighestOffer(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual({ order: mockOrder });
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('GetCollectibleHighestOffer'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch highest offer' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useHighestOffer(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() => useHighestOffer(defaultArgs));

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			tokenId: '2',
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
		};

		rerender(() => useHighestOffer(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toEqual({ order: mockOrder });
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseHighestOfferArgs = {
			chainId: '1',
			collectionAddress: zeroAddress,
			tokenId: '1',
		};

		const { result } = renderHook(() => useHighestOffer(argsWithoutQuery));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});

	it('should validate input parameters', async () => {
		const invalidArgs = {
			...defaultArgs,
			chainId: 'invalid-chain' as string, // Properly typed as string
		};

		const { result } = renderHook(() => useHighestOffer(invalidArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
	});
});
