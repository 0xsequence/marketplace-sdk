import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import {
	mockEthCollection,
	mockMetadataEndpoint,
	mockTokenMetadata,
} from '../../../_internal/api/__mocks__/metadata.msw';
import type { UseListTokenMetadataParams } from './useListTokenMetadata';
import { useListTokenMetadata } from './useListTokenMetadata';

describe('useListTokenMetadata', () => {
	const defaultArgs: UseListTokenMetadataParams = {
		chainId: mockEthCollection.chainId,
		contractAddress: mockEthCollection.address,
		tokenIds: ['1', '2', '3'],
	};

	it('should fetch token metadata successfully', async () => {
		const { result } = renderHook(() => useListTokenMetadata(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual([mockTokenMetadata]);
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

		const { result } = renderHook(() => useListTokenMetadata(defaultArgs));

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

		const { result } = renderHook(() => useListTokenMetadata(disabledParams));

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
			useListTokenMetadata(emptyTokensParams),
		);

		// Empty token IDs should disable the query
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle missing required parameters', () => {
		const invalidParams = {
			chainId: defaultArgs.chainId,
			contractAddress: '',
			tokenIds: defaultArgs.tokenIds,
		};

		const { result } = renderHook(() => useListTokenMetadata(invalidParams));

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
			contractAddress: '0x1234567890123456789012345678901234567890',
			tokenIds: ['10', '20', '30'],
		};

		const { result } = renderHook(() => useListTokenMetadata(customParams));

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
