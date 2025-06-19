import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { useGetTokenSuppliesMap } from '../useGetTokenSuppliesMap';

describe('useGetTokenSuppliesMap', () => {
	const defaultParams = {
		chainId: 1,
		collectionAddress: '0x1234567890123456789012345678901234567890',
		tokenIds: ['1', '2', '3'],
	};

	const mockTokenSuppliesMap = {
		supplies: {
			[defaultParams.collectionAddress]: [
				{
					tokenID: '1',
					supply: '100',
				},
				{
					tokenID: '2',
					supply: '250',
				},
				{
					tokenID: '3',
					supply: '50',
				},
			],
		},
	};

	it('should fetch token supplies map successfully', async () => {
		// Mock the indexer API response
		server.use(
			http.post('*/rpc/Indexer/GetTokenSuppliesMap', () => {
				return HttpResponse.json(mockTokenSuppliesMap);
			}),
		);

		const { result } = renderHook(() => useGetTokenSuppliesMap(defaultParams));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockTokenSuppliesMap);
		expect(result.current.error).toBeNull();
	});

	it('should handle empty token IDs', async () => {
		const emptyParams = {
			...defaultParams,
			tokenIds: [],
		};

		const { result } = renderHook(() => useGetTokenSuppliesMap(emptyParams));

		// Should not trigger request with empty token IDs
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle disabled queries', async () => {
		const disabledParams = {
			...defaultParams,
			query: {
				enabled: false,
			},
		};

		const { result } = renderHook(() => useGetTokenSuppliesMap(disabledParams));

		// For disabled queries, we expect no loading state and no data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle API errors', async () => {
		// Mock API error
		server.use(
			http.post('*/rpc/Indexer/GetTokenSuppliesMap', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const { result } = renderHook(() => useGetTokenSuppliesMap(defaultParams));

		// Wait for error state
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeTruthy();
	});
});
