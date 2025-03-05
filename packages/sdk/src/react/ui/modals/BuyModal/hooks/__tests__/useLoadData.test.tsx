import { describe, expect, it, vi } from 'vitest';
import { MarketplaceKind } from '../../../../../_internal';
import { renderHook } from '../../../../../_internal/test-utils';
import { useCollectible, useCollection } from '../../../../../hooks';
import { useCheckoutOptions } from '../useCheckoutOptions';
import { useLoadData } from '../useLoadData';

// Mock dependencies
vi.mock('../../../../../hooks', () => ({
	useCollection: vi.fn(),
	useCollectible: vi.fn(),
}));

vi.mock('../useCheckoutOptions', () => ({
	useCheckoutOptions: vi.fn(),
}));

describe('useLoadData', () => {
	const defaultProps = {
		chainId: 1,
		collectionAddress: '0x123' as `0x${string}`,
		collectibleId: '1',
		orderId: '1',
		marketplace: MarketplaceKind.sequence_marketplace_v2,
	};

	it('should return loading state when any data is loading', () => {
		// Mock one hook to be loading
		(useCollection as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: null,
			isLoading: true,
			isError: false,
		});

		(useCollectible as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: null,
			isLoading: false,
			isError: false,
		});

		(useCheckoutOptions as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			{
				data: null,
				isLoading: false,
				isError: false,
			},
		);

		const { result } = renderHook(() => useLoadData(defaultProps));

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
		expect(result.current.collection).toBeNull();
		expect(result.current.collectable).toBeNull();
		expect(result.current.checkoutOptions).toBeNull();
	});

	it('should return error state when any request fails', () => {
		// Mock one hook to have an error
		(useCollection as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: null,
			isLoading: false,
			isError: true,
		});

		(useCollectible as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: null,
			isLoading: false,
			isError: false,
		});

		(useCheckoutOptions as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			{
				data: null,
				isLoading: false,
				isError: false,
			},
		);

		const { result } = renderHook(() => useLoadData(defaultProps));

		expect(result.current.isError).toBe(true);
		expect(result.current.isLoading).toBe(false);
	});

	it('should return all data when successfully loaded', () => {
		const mockCollection = { type: 'ERC721', name: 'Test Collection' };
		const mockCollectable = { tokenId: '1', name: 'Test NFT' };
		const mockCheckoutOptions = {
			swap: [],
			nftCheckout: [],
			onRamp: [],
			crypto: ['ETH'],
		};

		(useCollection as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: mockCollection,
			isLoading: false,
			isError: false,
		});

		(useCollectible as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: mockCollectable,
			isLoading: false,
			isError: false,
		});

		(useCheckoutOptions as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			{
				data: mockCheckoutOptions,
				isLoading: false,
				isError: false,
			},
		);

		const { result } = renderHook(() => useLoadData(defaultProps));

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.collection).toBe(mockCollection);
		expect(result.current.collectable).toBe(mockCollectable);
		expect(result.current.checkoutOptions).toBe(mockCheckoutOptions);
	});

	it('should handle partial data loading states', () => {
		// Mock different loading states for each hook
		(useCollection as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: { type: 'ERC721', name: 'Test Collection' },
			isLoading: false,
			isError: false,
		});

		(useCollectible as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: null,
			isLoading: true,
			isError: false,
		});

		(useCheckoutOptions as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			{
				data: {
					swap: [],
					nftCheckout: [],
					onRamp: [],
					crypto: ['ETH'],
				},
				isLoading: false,
				isError: false,
			},
		);

		const { result } = renderHook(() => useLoadData(defaultProps));

		// Should be loading if any data is loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);

		// Should have partial data available
		expect(result.current.collection).toBeDefined();
		expect(result.current.collectable).toBeNull();
		expect(result.current.checkoutOptions).toBeDefined();

		// Verify hook calls
		expect(useCollection).toHaveBeenCalledWith({
			chainId: defaultProps.chainId,
			collectionAddress: defaultProps.collectionAddress,
		});

		expect(useCollectible).toHaveBeenCalledWith({
			chainId: String(defaultProps.chainId),
			collectionAddress: defaultProps.collectionAddress,
			collectibleId: defaultProps.collectibleId,
		});

		expect(useCheckoutOptions).toHaveBeenCalledWith({
			chainId: defaultProps.chainId,
			collectionAddress: defaultProps.collectionAddress,
			orderId: defaultProps.orderId,
			marketplace: defaultProps.marketplace,
		});
	});
});
