import type { Address } from '@0xsequence/api-client';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { skipToken } from '@tanstack/react-query';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';

const { mockCheckoutOptions, mockMarketplaceEndpoint } = MarketplaceMocks;

import { usePrimarySaleCheckoutOptions } from './primary-sale-checkout-options';

// Mock wagmi useAccount hook
vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(),
	};
});

const mockUseAccount = vi.mocked(useAccount);

const mockContractAddress =
	'0x1234567890123456789012345678901234567890' as Address;
const mockCollectionAddress =
	'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as Address;

describe('usePrimarySaleCheckoutOptions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseAccount.mockReturnValue({
			address: zeroAddress,
		} as unknown as ReturnType<typeof useAccount>);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should fetch checkout options successfully', async () => {
		const { result } = renderHook(() =>
			usePrimarySaleCheckoutOptions({
				chainId: 1,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [
					{
						quantity: 1n,
						tokenId: 1n,
					},
				],
			}),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for successful response
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Check the response matches our mock
		expect(result.current.data).toEqual(mockCheckoutOptions);
	});

	it('should handle skipToken', () => {
		const { result } = renderHook(() =>
			usePrimarySaleCheckoutOptions(skipToken),
		);

		// Should not be loading when skipToken is passed
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle multiple items', async () => {
		const { result } = renderHook(() =>
			usePrimarySaleCheckoutOptions({
				chainId: 137,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [
					{
						quantity: 2n,
						tokenId: 1n,
					},
					{
						quantity: 1n,
						tokenId: 2n,
					},
				],
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toEqual(mockCheckoutOptions);
	});

	it('should refetch when args change', async () => {
		let chainIdProp = 1;
		const itemsProp = [{ quantity: 1n, tokenId: 1n }];

		const { result, rerender } = renderHook(() =>
			usePrimarySaleCheckoutOptions({
				chainId: chainIdProp,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: itemsProp,
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		const firstData = result.current.data;

		// Change chainId
		chainIdProp = 137;
		rerender();

		await waitFor(() => {
			expect(result.current.isFetching).toBe(true);
		});

		await waitFor(() => {
			expect(result.current.isFetching).toBe(false);
		});

		// Data should still be the same (mocked response doesn't change)
		expect(result.current.data).toEqual(firstData);
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('CheckoutOptionsSalesContract'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch checkout options' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			usePrimarySaleCheckoutOptions({
				chainId: 1,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [{ quantity: 1n, tokenId: 1n }],
			}),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle when wallet is not connected', async () => {
		// Mock wallet not connected for this test
		mockUseAccount.mockReturnValue({
			address: undefined,
		} as unknown as ReturnType<typeof useAccount>);

		const { result } = renderHook(() =>
			usePrimarySaleCheckoutOptions({
				chainId: 1,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [{ quantity: 1n, tokenId: 1n }],
			}),
		);

		// Should not make request when wallet not connected
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle empty items array', async () => {
		const { result } = renderHook(() =>
			usePrimarySaleCheckoutOptions({
				chainId: 1,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [],
			}),
		);

		// Should not make request when items array is empty
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
	});
});
