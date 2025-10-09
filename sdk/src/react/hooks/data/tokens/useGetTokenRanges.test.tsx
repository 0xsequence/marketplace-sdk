import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { mockIndexerEndpoint } from '../../../_internal/api/__mocks__/indexer.msw';
import type { UseGetTokenRangesParams } from './useGetTokenRanges';
import { useGetTokenRanges } from './useGetTokenRanges';

describe('useGetTokenRanges', () => {
	const defaultArgs: UseGetTokenRangesParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
	};

	it('should fetch token ranges successfully', async () => {
		const { result } = renderHook(() => useGetTokenRanges(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.data?.tokenIDRanges).toBeDefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockIndexerEndpoint('GetTokenIDRanges'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch token ranges' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useGetTokenRanges(defaultArgs));

		// Wait for the error state
		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useGetTokenRanges(defaultArgs),
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

		rerender(() => useGetTokenRanges(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle disabled query when required params are missing', async () => {
		const { result } = renderHook(() =>
			useGetTokenRanges({
				chainId: 0, // Invalid chainId should disable the query
				collectionAddress: zeroAddress,
			}),
		);

		// Query should be disabled when chainId is invalid
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle enabled/disabled state from query options', async () => {
		const { result } = renderHook(() =>
			useGetTokenRanges({
				...defaultArgs,
				query: {
					enabled: false, // Explicitly disable the query
				},
			}),
		);

		// Query should be disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
		expect(result.current.fetchStatus).toBe('idle');
	});
});
