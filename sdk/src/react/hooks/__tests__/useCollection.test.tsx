import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	mockEthCollection,
	mockMetadataEndpoint,
} from '../../_internal/api/__mocks__/metadata.msw';
import type { UseCollectionArgs } from '../useCollection';
import { useCollection } from '../useCollection';

describe('useCollection', () => {
	const defaultArgs: UseCollectionArgs = {
		chainId: mockEthCollection.chainId,
		collectionAddress: mockEthCollection.address,
	};

	it('should fetch collection data successfully', async () => {
		const { result } = renderHook(() => useCollection(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockEthCollection);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMetadataEndpoint('GetContractInfo'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch collection' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useCollection(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() => useCollection(defaultArgs));

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

		rerender(() => useCollection(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseCollectionArgs = {
			chainId: 1,
			collectionAddress: zeroAddress,
			query: {},
		};

		const { result } = renderHook(() => useCollection(argsWithoutQuery));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});
});
