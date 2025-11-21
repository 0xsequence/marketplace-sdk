import { MetadataMocks } from '@0xsequence/api-client';

const {
	mockEthCollection,
	mockMetadataEndpoint,
	mockTokenMetadata,
	mockTokenMetadataNormalized,
} = MetadataMocks;

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import type { UseTokenMetadataParams } from './metadata';
import { useTokenMetadata } from './metadata';

describe('useTokenMetadata', () => {
	const defaultArgs: UseTokenMetadataParams = {
		chainId: mockEthCollection.chainId,
		contractAddress: mockEthCollection.address as `0x${string}`,
		tokenIds: [1n, 2n, 3n],
	};

	it('should fetch token metadata successfully', async () => {
		const { result } = renderHook(() => useTokenMetadata(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock (normalized with BigInt)
		expect(result.current.data).toEqual([mockTokenMetadataNormalized]);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMetadataEndpoint('GetTokenMetadata'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch token metadata' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useTokenMetadata(defaultArgs));

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

		const { result } = renderHook(() => useTokenMetadata(disabledParams));

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

		const { result } = renderHook(() => useTokenMetadata(emptyTokensParams));

		// Empty token IDs should disable the query
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle missing required parameters', () => {
		const invalidParams = {
			chainId: defaultArgs.chainId,
			contractAddress: '' as `0x${string}`,
			tokenIds: defaultArgs.tokenIds,
		};

		const { result } = renderHook(() => useTokenMetadata(invalidParams));

		// Missing contract address should disable the query
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should pass correct parameters to API', async () => {
		let capturedRequest: unknown;

		// Override the handler to capture the request
		server.use(
			http.post(mockMetadataEndpoint('GetTokenMetadata'), async (request) => {
				capturedRequest = await request.request.json();
				return HttpResponse.json({
					tokenMetadata: [mockTokenMetadata],
				});
			}),
		);

		const customParams = {
			chainId: 137,
			contractAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
			tokenIds: [10n, 20n, 30n],
		};

		const { result } = renderHook(() => useTokenMetadata(customParams));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the API was called with correct parameters
		expect(capturedRequest).toEqual({
			chainID: '137',
			contractAddress: '0x1234567890123456789012345678901234567890',
			tokenIDs: ['10', '20', '30'],
		});
	});
});
