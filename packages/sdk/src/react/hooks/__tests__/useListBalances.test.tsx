import { waitFor } from '@testing-library/react';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { mockTokenBalance } from '../../_internal/api/__mocks__/indexer.msw';
import { renderHook } from '../../_internal/test-utils';
import { useListBalances } from '../useListBalances';

describe('useListBalances', () => {
	it('should fetch token balances successfully', async () => {
		const { result } = renderHook(() =>
			useListBalances({
				chainId: 1,
				accountAddress: zeroAddress,
				query: {
					enabled: true,
				},
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data?.pages[0].balances).toEqual([mockTokenBalance]);
	});

	it('should handle pagination correctly', async () => {
		const { result } = renderHook(() =>
			useListBalances({
				chainId: 1,
				accountAddress: zeroAddress,
				query: {
					enabled: true,
				},
				page: {
					pageSize: 10,
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
			useListBalances({
				chainId: 1,
				accountAddress: zeroAddress,
				contractAddress: zeroAddress,
				tokenId: '1',
				includeMetadata: true,
				includeCollectionTokens: true,
				query: {
					enabled: true,
				},
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
			useListBalances({
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
			useListBalances({
				chainId: 1,
				accountAddress: zeroAddress,
				metadataOptions: {
					verifiedOnly: true,
					includeContracts: [zeroAddress],
				},
				query: {
					enabled: true,
				},
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		const balance = result.current.data?.pages[0].balances[0];
		expect(balance?.contractInfo?.extensions.verified).toBe(true);
	});

	it('should validate input parameters', async () => {
		const invalidChainId = 'invalid' as number | string;

		const { result } = renderHook(() =>
			useListBalances({
				chainId: invalidChainId,
				accountAddress: zeroAddress,
				query: {
					enabled: true,
				},
			}),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
	});
});
