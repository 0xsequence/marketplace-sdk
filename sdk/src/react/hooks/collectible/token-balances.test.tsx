import { IndexerMocks } from '@0xsequence/api-client';

const { mockIndexerEndpoint, mockTokenBalance, mockTokenBalanceNormalized } =
	IndexerMocks;

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { useCollectibleTokenBalances } from './token-balances';

describe('useCollectibleTokenBalances', () => {
	const defaultArgs = {
		collectionAddress: zeroAddress,
		userAddress: '0x1234567890123456789012345678901234567890' as `0x${string}`,
		chainId: 1,
	};

	it('should fetch balances successfully', async () => {
		// Override the handler specifically for this test
		// MSW returns RAW format, which gets transformed to normalized by the client
		server.use(
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					balances: [mockTokenBalance, { ...mockTokenBalance, tokenID: '2' }],
				});
			}),
		);

		const { result } = renderHook(() =>
			useCollectibleTokenBalances(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);

		// Wait for the query to complete
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Check the returned data matches mock (normalized with BigInt)
		expect(result.current.data).toHaveLength(2);
		expect(result.current.data?.[0]).toEqual(mockTokenBalanceNormalized);
		expect(result.current.data?.[1].tokenId).toBe(2n);
	});

	it('should return empty array when userAddress is undefined', () => {
		const { result } = renderHook(() =>
			useCollectibleTokenBalances({
				...defaultArgs,
				userAddress: undefined,
			}),
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.isLoading).toBe(false);
	});

	it('should respect enabled option in query config', () => {
		const { result } = renderHook(() =>
			useCollectibleTokenBalances({
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

		const { result } = renderHook(() =>
			useCollectibleTokenBalances(invalidArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
	});

	it('should return all token balances for a collection', async () => {
		const specificCollection = {
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
			userAddress:
				'0xabcdef1234567890abcdef1234567890abcdef12' as `0x${string}`,
			chainId: 1,
		};

		// MSW returns RAW format (strings)
		const balancesRaw = [
			{
				...mockTokenBalance,
				contractAddress: specificCollection.collectionAddress,
				accountAddress: specificCollection.userAddress,
				tokenID: '1',
				balance: '2',
			},
			{
				...mockTokenBalance,
				contractAddress: specificCollection.collectionAddress,
				accountAddress: specificCollection.userAddress,
				tokenID: '2',
				balance: '1',
			},
		];

		// Expected normalized format (BigInt)
		const balancesNormalized = [
			{
				...mockTokenBalanceNormalized,
				contractAddress: specificCollection.collectionAddress,
				accountAddress: specificCollection.userAddress,
				tokenId: 1n,
				balance: 2n,
			},
			{
				...mockTokenBalanceNormalized,
				contractAddress: specificCollection.collectionAddress,
				accountAddress: specificCollection.userAddress,
				tokenId: 2n,
				balance: 1n,
			},
		];

		server.use(
			http.post(mockIndexerEndpoint('GetTokenBalances'), () => {
				return HttpResponse.json({
					page: { page: 1, pageSize: 10, more: false },
					balances: balancesRaw,
				});
			}),
		);

		const { result } = renderHook(() =>
			useCollectibleTokenBalances(specificCollection),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify all token balances (normalized format)
		expect(result.current.data).toEqual(balancesNormalized);
		expect(result.current.data).toHaveLength(2);
		expect(result.current.data?.[0].balance).toBe(2n);
		expect(result.current.data?.[1].balance).toBe(1n);
		expect(
			result.current.data?.every(
				(b) => b.contractAddress === specificCollection.collectionAddress,
			),
		).toBe(true);
		expect(
			result.current.data?.every(
				(b) => b.accountAddress === specificCollection.userAddress,
			),
		).toBe(true);
	});
});
