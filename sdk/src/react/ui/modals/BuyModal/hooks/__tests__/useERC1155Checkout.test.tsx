import { renderHook } from '@test';
import type { Address } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	type CheckoutOptions,
	TransactionCrypto,
} from '../../../../../_internal';
import { useERC1155Checkout } from '../useERC1155Checkout';

// Mock @0xsequence/checkout
vi.mock('@0xsequence/checkout', () => ({
	useERC1155SaleContractCheckout: vi.fn(() => ({
		openCheckoutModal: vi.fn(),
		isLoading: false,
		isError: false,
	})),
}));

// Mock wagmi's useAccount hook
vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(() => ({
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
		})),
	};
});

// Mock store hooks
vi.mock('../../store', () => ({
	useQuantity: vi.fn(() => 2),
	useOnSuccess: vi.fn(() => vi.fn()),
	useOnError: vi.fn(() => vi.fn()),
	useBuyAnalyticsId: vi.fn(() => '123'),
	buyModalStore: {
		send: vi.fn(),
	},
}));

const mockCheckoutOptions = {
	crypto: TransactionCrypto.all,
	swap: [],
	nftCheckout: [],
	onRamp: [],
} satisfies CheckoutOptions;

const mockItems = [
	{ tokenId: '1', quantity: '2' },
	{ tokenId: '2', quantity: '1' },
];

describe('useERC1155Checkout', () => {
	let mockUseERC1155SaleContractCheckout: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		vi.clearAllMocks();

		// Setup the mock for useERC1155SaleContractCheckout
		mockUseERC1155SaleContractCheckout = vi.mocked(
			(await import('@0xsequence/checkout')).useERC1155SaleContractCheckout,
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should call useERC1155SaleContractCheckout with correct parameters', () => {
		const mockCheckout = {
			openCheckoutModal: vi.fn(),
			isLoading: false,
			isError: false,
		};
		mockUseERC1155SaleContractCheckout.mockReturnValue(mockCheckout);

		const { result } = renderHook(() =>
			useERC1155Checkout({
				chainId: 1,
				salesContractAddress: '0x456',
				collectionAddress: '0x123',
				items: mockItems,
				checkoutOptions: mockCheckoutOptions,
				enabled: true,
			}),
		);

		expect(
			mockUseERC1155SaleContractCheckout.mock.calls,
		).toMatchInlineSnapshot(`
        [
          [
            {
              "chain": 1,
              "chainId": "1",
              "checkoutOptions": {
                "crypto": "all",
                "nftCheckout": [],
                "onRamp": [],
                "swap": [],
              },
              "collectionAddress": "0x123",
              "contractAddress": "0x456",
              "customProviderCallback": undefined,
              "items": [
                {
                  "quantity": "2",
                  "tokenId": "1",
                },
              ],
              "onClose": [Function],
              "onError": [Function],
              "onSuccess": [Function],
              "supplementaryAnalyticsInfo": {
                "marketplaceType": "shop",
                "saleAnalyticsId": "123",
              },
              "wallet": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            },
          ],
        ]
      `);

		expect(result.current.isEnabled).toBe(true);
	});

	it('should return isEnabled false when no wallet is connected', async () => {
		const { useAccount } = vi.mocked(await import('wagmi'));
		useAccount.mockReturnValue({
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
		} as never);

		const mockCheckout = {
			openCheckoutModal: vi.fn(),
			isLoading: false,
			isError: false,
		};
		mockUseERC1155SaleContractCheckout.mockReturnValue(mockCheckout);

		const { result } = renderHook(() =>
			useERC1155Checkout({
				chainId: 1,
				salesContractAddress: '0x456',
				collectionAddress: '0x123',
				items: mockItems,
				enabled: true,
			}),
		);

		expect(result.current.isEnabled).toBe(false);
	});

	it('should return isEnabled false when explicitly disabled', () => {
		const mockCheckout = {
			openCheckoutModal: vi.fn(),
			isLoading: false,
			isError: false,
		};
		mockUseERC1155SaleContractCheckout.mockReturnValue(mockCheckout);

		const { result } = renderHook(() =>
			useERC1155Checkout({
				chainId: 1,
				salesContractAddress: '0x456',
				collectionAddress: '0x123',
				items: mockItems,
				enabled: false,
			}),
		);

		expect(result.current.isEnabled).toBe(false);
	});

	it('should handle custom provider callback', () => {
		const customCallback = vi.fn();
		const mockCheckout = {
			openCheckoutModal: vi.fn(),
			isLoading: false,
			isError: false,
		};
		mockUseERC1155SaleContractCheckout.mockReturnValue(mockCheckout);

		renderHook(() =>
			useERC1155Checkout({
				chainId: 1,
				salesContractAddress: '0x456',
				collectionAddress: '0x123',
				items: mockItems,
				customProviderCallback: customCallback,
				enabled: true,
			}),
		);

		expect(mockUseERC1155SaleContractCheckout).toHaveBeenCalledWith(
			expect.objectContaining({
				customProviderCallback: customCallback,
			}),
		);
	});

	it('should use default quantity of 1 when quantity store returns null', async () => {
		const storeModule = await import('../../store');
		const useQuantitySpy = vi.spyOn(storeModule, 'useQuantity');
		useQuantitySpy.mockReturnValue(null);

		const mockCheckout = {
			openCheckoutModal: vi.fn(),
			isLoading: false,
			isError: false,
		};
		mockUseERC1155SaleContractCheckout.mockReturnValue(mockCheckout);

		renderHook(() =>
			useERC1155Checkout({
				chainId: 1,
				salesContractAddress: '0x456',
				collectionAddress: '0x123',
				items: mockItems,
				enabled: true,
			}),
		);

		expect(mockUseERC1155SaleContractCheckout).toHaveBeenCalledWith(
			expect.objectContaining({
				items: [
					{
						tokenId: '1',
						quantity: '1', // Default value
					},
				],
			}),
		);

		useQuantitySpy.mockRestore();
	});

	it('should handle different chain IDs', () => {
		const mockCheckout = {
			openCheckoutModal: vi.fn(),
			isLoading: false,
			isError: false,
		};
		mockUseERC1155SaleContractCheckout.mockReturnValue(mockCheckout);

		renderHook(() =>
			useERC1155Checkout({
				chainId: 137, // Polygon
				salesContractAddress: '0x456',
				collectionAddress: '0x123',
				items: mockItems,
				enabled: true,
			}),
		);

		expect(mockUseERC1155SaleContractCheckout).toHaveBeenCalledWith(
			expect.objectContaining({
				chain: 137,
			}),
		);
	});

	it('should omit checkoutOptions when not provided', () => {
		const mockCheckout = {
			openCheckoutModal: vi.fn(),
			isLoading: false,
			isError: false,
		};
		mockUseERC1155SaleContractCheckout.mockReturnValue(mockCheckout);

		renderHook(() =>
			useERC1155Checkout({
				chainId: 1,
				salesContractAddress: '0x456',
				collectionAddress: '0x123',
				items: mockItems,
				enabled: true,
			}),
		);

		const callArgs = mockUseERC1155SaleContractCheckout.mock.calls[0][0];
		expect(callArgs).not.toHaveProperty('checkoutOptions');
	});

	it('should spread all properties from useERC1155SaleContractCheckout', () => {
		const mockCheckout = {
			openCheckoutModal: vi.fn(),
			isLoading: false,
			isError: false,
			additionalProp: 'test',
		};
		mockUseERC1155SaleContractCheckout.mockReturnValue(mockCheckout);

		const { result } = renderHook(() =>
			useERC1155Checkout({
				chainId: 1,
				salesContractAddress: '0x456',
				collectionAddress: '0x123',
				items: mockItems,
				enabled: true,
			}),
		);

		expect(result.current.openCheckoutModal).toBe(
			mockCheckout.openCheckoutModal,
		);
		expect(result.current.isLoading).toBe(mockCheckout.isLoading);
		expect(result.current.isError).toBe(mockCheckout.isError);
	});

	it('should include callback functions in checkout params', () => {
		const mockCheckout = {
			openCheckoutModal: vi.fn(),
			isLoading: false,
			isError: false,
		};
		mockUseERC1155SaleContractCheckout.mockReturnValue(mockCheckout);

		renderHook(() =>
			useERC1155Checkout({
				chainId: 1,
				salesContractAddress: '0x456',
				collectionAddress: '0x123',
				items: mockItems,
				enabled: true,
			}),
		);

		const callArgs = mockUseERC1155SaleContractCheckout.mock.calls[0][0];

		expect(callArgs.onSuccess).toBeInstanceOf(Function);
		expect(callArgs.onError).toBeInstanceOf(Function);
		expect(callArgs.onClose).toBeInstanceOf(Function);
	});

	it('should use empty wallet string when address is undefined', async () => {
		const { useAccount } = vi.mocked(await import('wagmi'));
		useAccount.mockReturnValue({
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
		} as never);

		const mockCheckout = {
			openCheckoutModal: vi.fn(),
			isLoading: false,
			isError: false,
		};
		mockUseERC1155SaleContractCheckout.mockReturnValue(mockCheckout);

		renderHook(() =>
			useERC1155Checkout({
				chainId: 1,
				salesContractAddress: '0x456',
				collectionAddress: '0x123',
				items: mockItems,
				enabled: true,
			}),
		);

		expect(mockUseERC1155SaleContractCheckout).toHaveBeenCalledWith(
			expect.objectContaining({
				wallet: '',
			}),
		);
	});
});
