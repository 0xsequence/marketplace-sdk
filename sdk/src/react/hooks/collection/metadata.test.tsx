import * as MetadataMocks from '@0xsequence/api-client/mocks/metadata';

const { mockEthCollection, mockMetadataEndpoint } = MetadataMocks;

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	type UseCollectionMetadataParams as UseCollectionDetailParams,
	useCollectionMetadata as useCollectionDetail,
} from './metadata';

describe('useCollectionDetail', () => {
	const defaultArgs: UseCollectionDetailParams = {
		chainId: mockEthCollection.chainId,
		collectionAddress: mockEthCollection.address as `0x${string}`,
	};

	it('should fetch collection data successfully', async () => {
		const { result } = renderHook(() => useCollectionDetail(defaultArgs));

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

		const { result } = renderHook(() => useCollectionDetail(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCollectionDetail(defaultArgs),
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

		rerender(() => useCollectionDetail(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseCollectionDetailParams = {
			chainId: 1,
			collectionAddress: zeroAddress,
			query: {},
		};

		const { result } = renderHook(() => useCollectionDetail(argsWithoutQuery));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});
});
