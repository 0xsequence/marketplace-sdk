import { skipToken } from '@tanstack/react-query';
import { renderHook, waitFor } from '@test';
import type { Address } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCheckoutOptionsSalesContract } from '../useCheckoutOptionsSalesContract';

// Mock wagmi's useAccount hook
vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(() => ({ address: '0xTestWallet' as Address })),
	};
});

const mockContractAddress =
	'0x1234567890123456789012345678901234567890' as Address;
const mockCollectionAddress =
	'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as Address;

describe('useCheckoutOptionsSalesContract', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should fetch checkout options successfully', async () => {
		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract({
				chainId: 1,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [
					{
						quantity: '1',
						tokenId: '1',
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

		// Check the response
		expect(result.current.data).toEqual({
			options: {
				crypto: 'all',
				swap: [],
				nftCheckout: [],
				onRamp: [],
			},
		});
	});

	it('should handle skipToken', () => {
		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract(skipToken),
		);

		// Should not be loading when skipToken is passed
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle multiple items', async () => {
		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract({
				chainId: 137,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [
					{
						quantity: '2',
						tokenId: '1',
					},
					{
						quantity: '1',
						tokenId: '2',
					},
				],
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.data?.options).toBeDefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(
			({ chainId, items }) =>
				useCheckoutOptionsSalesContract({
					chainId,
					contractAddress: mockContractAddress,
					collectionAddress: mockCollectionAddress,
					items,
				}),
			{
				initialProps: {
					chainId: 1,
					items: [{ quantity: '1', tokenId: '1' }],
				},
			},
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		const firstData = result.current.data;

		// Change chainId
		rerender({
			chainId: 137,
			items: [{ quantity: '1', tokenId: '1' }],
		});

		await waitFor(() => {
			expect(result.current.isFetching).toBe(true);
		});

		await waitFor(() => {
			expect(result.current.isFetching).toBe(false);
		});

		// Data should still be the same (mocked response doesn't change)
		expect(result.current.data).toEqual(firstData);
	});

	it('should use wallet address from useAccount', async () => {
		const { useAccount } = await import('wagmi');
		const mockUseAccount = vi.mocked(useAccount);

		// Set a specific address
		mockUseAccount.mockReturnValue({
			address: '0xSpecificWallet' as Address,
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			connector: null,
			addresses: undefined,
			chain: undefined,
			chainId: undefined,
			status: 'connected',
		} as ReturnType<typeof useAccount>);

		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract({
				chainId: 1,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [{ quantity: '1', tokenId: '1' }],
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeDefined();
	});

	it('should handle when wallet is not connected', async () => {
		const { useAccount } = await import('wagmi');
		const mockUseAccount = vi.mocked(useAccount);

		// No wallet connected
		mockUseAccount.mockReturnValue({
			address: undefined,
			isConnected: false,
			isConnecting: false,
			isDisconnected: true,
			isReconnecting: false,
			connector: null,
			addresses: undefined,
			chain: undefined,
			chainId: undefined,
			status: 'disconnected',
		} as ReturnType<typeof useAccount>);

		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract({
				chainId: 1,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [{ quantity: '1', tokenId: '1' }],
			}),
		);

		// The hook will still try to fetch even without a wallet (using undefined)
		// Wait for it to complete
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// The API should still return data even without wallet
		expect(result.current.data).toBeDefined();
	});

	it('should handle empty items array', async () => {
		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract({
				chainId: 1,
				contractAddress: mockContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [],
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeDefined();
	});
});
