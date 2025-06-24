import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	mockIndexerEndpoint,
	mockTokenBalance,
} from '../../_internal/api/__mocks__/indexer.msw';
import { useBalanceOfCollectible } from '../useBalanceOfCollectible';

describe('useBalanceOfCollectible', () => {
	const defaultArgs = {
		collectionAddress: zeroAddress,
		collectableId: '1',
		userAddress: '0x1234567890123456789012345678901234567890' as `0x${string}`,
		chainId: 1,
	};

	it('should fetch balance successfully', async () => {
		// Override the handler specifically for this test
		server.use(
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					balances: [mockTokenBalance],
				});
			}),
		);

		const { result } = renderHook(() => useBalanceOfCollectible(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);

		// Wait for the query to complete
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Check the returned data matches mock
		expect(result.current.data).toEqual(mockTokenBalance);
	});

	it('should return null when userAddress is undefined', () => {
		const { result } = renderHook(() =>
			useBalanceOfCollectible({
				...defaultArgs,
				userAddress: undefined,
			}),
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.isLoading).toBe(false);
	});

	it('should respect enabled option in query config', () => {
		const { result } = renderHook(() =>
			useBalanceOfCollectible({
				...defaultArgs,
				query: {
					enabled: false,
				},
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle error states', async () => {
		// Override the handler to return an error
		server.use(
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return HttpResponse.json(
					{ error: { message: 'Invalid address format' } },
					{ status: 400 },
				);
			}),
		);

		const invalidArgs = {
			...defaultArgs,
			collectionAddress: '0xinvalid' as `0x${string}`, // Invalid address format
		};

		const { result } = renderHook(() => useBalanceOfCollectible(invalidArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
	});

	it('should return correct balance for specific collectible', async () => {
		const specificCollectible = {
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
			collectableId: '42',
			userAddress:
				'0xabcdef1234567890abcdef1234567890abcdef12' as `0x${string}`,
			chainId: 1,
		};

		const specificBalance = {
			...mockTokenBalance,
			contractAddress: specificCollectible.collectionAddress,
			accountAddress: specificCollectible.userAddress,
			tokenID: specificCollectible.collectableId,
			balance: '2', // User owns 2 of this collectible
		};

		server.use(
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					balances: [specificBalance],
				});
			}),
		);

		const { result } = renderHook(() =>
			useBalanceOfCollectible(specificCollectible),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify the specific collectible balance
		expect(result.current.data).toEqual(specificBalance);
		expect(result.current.data?.balance).toBe('2');
		expect(result.current.data?.contractAddress).toBe(
			specificCollectible.collectionAddress,
		);
		expect(result.current.data?.tokenID).toBe(
			specificCollectible.collectableId,
		);
		expect(result.current.data?.accountAddress).toBe(
			specificCollectible.userAddress,
		);
	});
});
