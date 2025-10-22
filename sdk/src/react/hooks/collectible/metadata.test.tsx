import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	mockMetadataEndpoint,
	mockTokenMetadata,
} from '../../_internal/api/__mocks__/metadata.msw';
import type { UseCollectibleMetadataParams as UseCollectibleDetailParams } from './metadata';
import { useCollectibleMetadata as useCollectibleDetail } from './metadata';

describe('useCollectibleDetail', () => {
	const defaultArgs: UseCollectibleDetailParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		collectibleId: '1',
		query: {},
	};

	it('should fetch collectible data successfully', async () => {
		const { result } = renderHook(() => useCollectibleDetail(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockTokenMetadata);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMetadataEndpoint('GetTokenMetadata'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch collectible' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useCollectibleDetail(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCollectibleDetail(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			collectibleId: '2',
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
		};

		rerender(() => useCollectibleDetail(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseCollectibleDetailParams = {
			chainId: 1,
			collectionAddress: zeroAddress,
			collectibleId: '1',
			query: {},
		};

		const { result } = renderHook(() => useCollectibleDetail(argsWithoutQuery));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});

	it('should not fetch when required params are missing', async () => {
		const incompleteArgs = {
			chainId: 1,
			// Missing collectionAddress and collectibleId
		} as UseCollectibleDetailParams;

		const { result } = renderHook(() => useCollectibleDetail(incompleteArgs));

		// Should not be loading since enabled condition fails
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
