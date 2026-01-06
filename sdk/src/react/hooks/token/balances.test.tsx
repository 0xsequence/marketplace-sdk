import * as IndexerMocks from '@0xsequence/api-client/mocks/indexer';
import { renderHook } from '@test';
import { waitFor } from '@testing-library/react';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';

const { mockTokenBalanceNormalized } = IndexerMocks;

import { useTokenBalances } from './balances';

describe('useTokenBalances', () => {
	it('should fetch token balances successfully', async () => {
		const { result } = renderHook(() =>
			useTokenBalances({
				chainId: 1,
				accountAddress: zeroAddress,
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data?.pages[0].balances).toEqual([
			mockTokenBalanceNormalized,
		]);
	});

	it('should handle pagination correctly', async () => {
		const { result } = renderHook(() =>
			useTokenBalances({
				chainId: 1,
				accountAddress: zeroAddress,
				page: {
					page: 1,
					pageSize: 10,
					more: false,
				},
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data?.pages[0].page).toEqual({
			page: 1,
			pageSize: 10,
			more: false,
		});
	});

	it('should handle optional parameters', async () => {
		const { result } = renderHook(() =>
			useTokenBalances({
				chainId: 1,
				accountAddress: zeroAddress,
				contractAddress: zeroAddress,
				tokenId: 1n,
				includeMetadata: true,
				includeCollectionTokens: true,
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		const balance = result.current.data?.pages[0].balances[0];
		expect(balance?.contractInfo).toBeDefined();
		expect(balance?.tokenMetadata).toBeDefined();
	});

	it('should handle disabled queries', async () => {
		const { result } = renderHook(() =>
			useTokenBalances({
				chainId: 1,
				accountAddress: zeroAddress,
				query: {
					enabled: false,
				},
			}),
		);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle metadata options', async () => {
		const { result } = renderHook(() =>
			useTokenBalances({
				chainId: 1,
				accountAddress: zeroAddress,
				metadataOptions: {
					verifiedOnly: true,
					includeContracts: [zeroAddress],
				},
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		const balance = result.current.data?.pages[0].balances[0];
		expect(balance?.contractInfo?.extensions?.verified).toBe(true);
	});
});
