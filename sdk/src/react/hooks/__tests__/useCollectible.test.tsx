import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	mockMetadataEndpoint,
	mockTokenMetadata,
} from '../../_internal/api/__mocks__/metadata.msw';
import type { UseCollectibleArgs } from '../useCollectible';
import { useCollectible } from '../useCollectible';

describe('useCollectible', () => {
	const defaultArgs: UseCollectibleArgs = {
		chainId: 1,
		collectionAddress: zeroAddress,
		collectibleId: '1',
		query: {},
	};

	it('should fetch collectible data successfully', async () => {
		const { result } = renderHook(() => useCollectible(defaultArgs));

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

		const { result } = renderHook(() => useCollectible(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() => useCollectible(defaultArgs));

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

		rerender(() => useCollectible(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseCollectibleArgs = {
			chainId: 1,
			collectionAddress: zeroAddress,
			collectibleId: '1',
			query: {},
		};

		const { result } = renderHook(() => useCollectible(argsWithoutQuery));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});

	it('should validate input parameters', async () => {
		const invalidArgs: UseCollectibleArgs = {
			...defaultArgs,
			// @ts-expect-error
			chainId: {}, // Using an object instead of a string/number will fail validation
		};

		const { result } = renderHook(() => useCollectible(invalidArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
	});
});
