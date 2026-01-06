import * as IndexerMocks from '@0xsequence/api-client/mocks/indexer';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';

const { mockIndexerEndpoint, mockTokenBalance, mockTokenBalanceNormalized } =
	IndexerMocks;

import { useCollectibleBalance } from './balance';

describe('useCollectibleBalance', () => {
	const defaultArgs = {
		collectionAddress: zeroAddress,
		tokenId: 1n,
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

		const { result } = renderHook(() => useCollectibleBalance(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);

		// Wait for the query to complete
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Check the returned data matches mock (normalized with BigInt)
		expect(result.current.data).toEqual(mockTokenBalanceNormalized);
	});

	it('should return null when userAddress is undefined', () => {
		const { result } = renderHook(() =>
			useCollectibleBalance({
				...defaultArgs,
				userAddress: undefined,
			}),
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.isLoading).toBe(false);
	});

	it('should respect enabled option in query config', () => {
		const { result } = renderHook(() =>
			useCollectibleBalance({
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

		const { result } = renderHook(() => useCollectibleBalance(invalidArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
	});

	it('should return correct balance for specific collectible', async () => {
		const specificCollectible = {
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
			tokenId: 42n,
			userAddress:
				'0xabcdef1234567890abcdef1234567890abcdef12' as `0x${string}`,
			chainId: 1,
		};

		// MSW returns RAW format (strings), which gets transformed to normalized format by the client
		const specificBalanceRaw = {
			...mockTokenBalance,
			contractAddress: specificCollectible.collectionAddress,
			accountAddress: specificCollectible.userAddress,
			tokenID: '42', // API expects string in response
			balance: '2', // Raw format uses strings
		};

		// Expected normalized format (BigInt)
		const specificBalanceNormalized = {
			...mockTokenBalanceNormalized,
			contractAddress: specificCollectible.collectionAddress,
			accountAddress: specificCollectible.userAddress,
			tokenId: 42n,
			balance: 2n,
		};

		server.use(
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					balances: [specificBalanceRaw],
				});
			}),
		);

		const { result } = renderHook(() =>
			useCollectibleBalance(specificCollectible),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify the specific collectible balance (normalized format with BigInt)
		expect(result.current.data).toEqual(specificBalanceNormalized);
		expect(result.current.data?.balance).toBe(2n);
		expect(result.current.data?.contractAddress).toBe(
			specificCollectible.collectionAddress,
		);
		expect(result.current.data?.tokenId).toBe(
			BigInt(specificCollectible.tokenId),
		);
		expect(result.current.data?.accountAddress).toBe(
			specificCollectible.userAddress,
		);
	});
});
