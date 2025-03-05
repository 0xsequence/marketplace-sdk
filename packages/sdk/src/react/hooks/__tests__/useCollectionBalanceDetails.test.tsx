import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { mockTokenBalance } from '../../_internal/api/__mocks__/indexer.msw';
import { mockIndexerEndpoint } from '../../_internal/api/__mocks__/indexer.msw';
import { renderHook } from '../../_internal/test-utils';
import { server } from '../../_internal/test/setup';
import { useCollectionBalanceDetails } from '../useCollectionBalanceDetails';

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

		// Verify the data matches our mock
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.balances[0]).toEqual(mockTokenBalance);
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
			expect.arrayContaining([mockTokenBalance, mockTokenBalance]),
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

	it('should handle validation errors', () => {
		expect(() =>
			renderHook(() =>
				useCollectionBalanceDetails({
					chainId: 'invalid-chain-id' as unknown as number,
					filter: {
						accountAddresses: [zeroAddress],
						omitNativeBalances: true,
					},
				}),
			),
		).toThrow();

		expect(() =>
			renderHook(() =>
				useCollectionBalanceDetails({
					chainId: 1,
					filter: {
						accountAddresses: ['invalid-address' as unknown as `0x${string}`],
						omitNativeBalances: true,
					},
				}),
			),
		).toThrow();
	});
});
