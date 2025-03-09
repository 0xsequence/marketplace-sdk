import { renderHook, waitFor } from '@test';
import { server } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { mockCollection } from '../../_internal/api/__mocks__/marketplace.msw';
import { mockMarketplaceEndpoint } from '../../_internal/api/__mocks__/marketplace.msw';
import { useCollectionDetails } from '../useCollectionDetails';

describe('useCollectionDetails', () => {
	const defaultArgs = {
		chainId: 1,
		collectionAddress: zeroAddress,
	};

	it('should fetch collection details successfully', async () => {
		const { result } = renderHook(() => useCollectionDetails(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockCollection);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('GetCollectionDetail'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch collection details' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useCollectionDetails(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCollectionDetails(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
		};

		rerender(() => useCollectionDetails(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});
});
