import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import type { UseGetTokenSuppliesMapParams } from '../useGetTokenSuppliesMap';
import { useGetTokenSuppliesMap } from '../useGetTokenSuppliesMap';

// Mock token supply data
const mockTokenSupplies = {
	supplies: {
		'0x1234567890123456789012345678901234567890': [
			{
				tokenID: '1',
				supply: '100',
			},
			{
				tokenID: '2',
				supply: '50',
			},
			{
				tokenID: '3',
				supply: '0',
			},
		],
	},
};

const mockIndexerEndpoint = (endpoint: string) => `*/rpc/Indexer/${endpoint}`;

describe('useGetTokenSuppliesMap', () => {
	const defaultArgs: UseGetTokenSuppliesMapParams = {
		chainId: 1,
		collectionAddress: '0x1234567890123456789012345678901234567890',
		tokenIds: ['1', '2', '3'],
	};

	// Setup default handlers
	server.use(
		http.post(mockIndexerEndpoint('GetTokenSuppliesMap'), () => {
			return HttpResponse.json(mockTokenSupplies);
		}),
	);

	it('should fetch token supplies map successfully', async () => {
		const { result } = renderHook(() => useGetTokenSuppliesMap(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockTokenSupplies);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockIndexerEndpoint('GetTokenSuppliesMap'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch token supplies' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useGetTokenSuppliesMap(defaultArgs));

		// Wait for error to be set
		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeTruthy();
	});

	it('should handle disabled queries', () => {
		const disabledParams = {
			...defaultArgs,
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

	it('should handle empty token IDs array', () => {
		const emptyTokensParams = {
			...defaultArgs,
			tokenIds: [],
		};

		const { result } = renderHook(() =>
			useGetTokenSuppliesMap(emptyTokensParams),
		);

		// Empty token IDs should disable the query
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle missing required parameters', () => {
		const invalidParams = {
			chainId: defaultArgs.chainId,
			collectionAddress: '',
			tokenIds: defaultArgs.tokenIds,
		};

		const { result } = renderHook(() => useGetTokenSuppliesMap(invalidParams));

		// Missing collection address should disable the query
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should pass correct parameters to API', async () => {
		let capturedRequest: unknown;

		// Override the handler to capture the request
		server.use(
			http.post(mockIndexerEndpoint('GetTokenSuppliesMap'), async (request) => {
				capturedRequest = await request.request.json();
				return HttpResponse.json(mockTokenSupplies);
			}),
		);

		const customParams = {
			chainId: 137,
			collectionAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			tokenIds: ['10', '20', '30'],
			includeMetadata: true,
		};

		const { result } = renderHook(() => useGetTokenSuppliesMap(customParams));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the API was called with correct parameters
		expect(capturedRequest).toEqual({
			tokenMap: {
				'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd': ['10', '20', '30'],
			},
			includeMetadata: true,
		});
	});

	it('should default includeMetadata to false when not specified', async () => {
		let capturedRequest: unknown;

		// Override the handler to capture the request
		server.use(
			http.post(mockIndexerEndpoint('GetTokenSuppliesMap'), async (request) => {
				capturedRequest = await request.request.json();
				return HttpResponse.json(mockTokenSupplies);
			}),
		);

		const { result } = renderHook(() => useGetTokenSuppliesMap(defaultArgs));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify includeMetadata defaults appropriately
		expect(capturedRequest).toEqual({
			tokenMap: {
				'0x1234567890123456789012345678901234567890': ['1', '2', '3'],
			},
		});
		expect(capturedRequest.includeMetadata).toBeUndefined();
	});
});
