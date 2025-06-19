import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { useListTokenMetadata } from '../useListTokenMetadata';

describe('useListTokenMetadata', () => {
	const defaultParams = {
		chainId: 1,
		contractAddress: '0x1234567890123456789012345678901234567890',
		tokenIds: ['1', '2', '3'],
	};

	const mockTokenMetadata = [
		{
			tokenId: '1',
			contractAddress: '0x1234567890123456789012345678901234567890',
			name: 'Token 1',
			description: 'First token',
			image: 'https://example.com/1.png',
		},
		{
			tokenId: '2',
			contractAddress: '0x1234567890123456789012345678901234567890',
			name: 'Token 2',
			description: 'Second token',
			image: 'https://example.com/2.png',
		},
		{
			tokenId: '3',
			contractAddress: '0x1234567890123456789012345678901234567890',
			name: 'Token 3',
			description: 'Third token',
			image: 'https://example.com/3.png',
		},
	];

	it('should fetch token metadata successfully', async () => {
		// Mock the metadata API response
		server.use(
			http.post('*/rpc/Metadata/GetTokenMetadata', () => {
				return HttpResponse.json({
					tokenMetadata: mockTokenMetadata,
				});
			}),
		);

		const { result } = renderHook(() => useListTokenMetadata(defaultParams));

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

	it('should handle empty token IDs', async () => {
		const emptyParams = {
			...defaultParams,
			tokenIds: [],
		};

		const { result } = renderHook(() => useListTokenMetadata(emptyParams));

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

		const { result } = renderHook(() => useListTokenMetadata(disabledParams));

		// For disabled queries, we expect no loading state and no data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle API errors', async () => {
		// Mock API error
		server.use(
			http.post('*/rpc/Metadata/GetTokenMetadata', () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const { result } = renderHook(() => useListTokenMetadata(defaultParams));

		// Wait for error state
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeTruthy();
	});
});
