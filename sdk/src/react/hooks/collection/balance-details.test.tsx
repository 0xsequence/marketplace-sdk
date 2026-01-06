import * as IndexerMocks from '@0xsequence/api-client/mocks/indexer';

const { mockIndexerEndpoint, mockTokenBalanceNormalized } = IndexerMocks;

import { renderHook, server } from '@test';
import { waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { useCollectionBalanceDetails } from './balance-details';

describe('useCollectionBalanceDetails', () => {
	const defaultArgs = {
		chainId: 1,
		filter: {
			accountAddresses: [zeroAddress],
			omitNativeBalances: true,
		},
	};

	it('should fetch balance details successfully', async () => {
		const { result } = renderHook(() =>
			useCollectionBalanceDetails(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock (normalized with BigInt)
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.balances[0]).toEqual(
			mockTokenBalanceNormalized,
		);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockIndexerEndpoint('GetTokenBalancesDetails'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch balances' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useCollectionBalanceDetails(defaultArgs),
		);

		// Wait for the error state
		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() =>
			useCollectionBalanceDetails(defaultArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			filter: {
				...defaultArgs.filter,
				accountAddresses: [
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				],
			},
		};

		rerender(() => useCollectionBalanceDetails(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle multiple accounts', async () => {
		const multipleAccountsArgs = {
			...defaultArgs,
			filter: {
				...defaultArgs.filter,
				accountAddresses: [
					zeroAddress,
					'0x1234567890123456789012345678901234567890' as `0x${string}`,
				],
			},
		};

		const { result } = renderHook(() =>
			useCollectionBalanceDetails(multipleAccountsArgs),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data?.balances).toHaveLength(2);
		expect(result.current.data?.balances).toEqual(
			expect.arrayContaining([
				mockTokenBalanceNormalized,
				mockTokenBalanceNormalized,
			]),
		);
	});

	it('should handle contract whitelist filter', async () => {
		const whitelistArgs = {
			...defaultArgs,
			filter: {
				...defaultArgs.filter,
				contractWhitelist: [zeroAddress],
			},
		};

		const { result } = renderHook(() =>
			useCollectionBalanceDetails(whitelistArgs),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data?.balances[0].contractAddress).toBe(zeroAddress);
	});

	it('should handle disabled query when required params are missing', async () => {
		const { result } = renderHook(() =>
			useCollectionBalanceDetails({
				chainId: 1,
				filter: {
					accountAddresses: [], // Empty array should disable the query
					omitNativeBalances: true,
				},
			}),
		);

		// Query should be disabled when accountAddresses is empty
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});
});
