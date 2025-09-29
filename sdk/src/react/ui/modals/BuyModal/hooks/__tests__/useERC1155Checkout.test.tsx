import { renderHook } from '@test';
import type { Address } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	type CheckoutOptions,
	TransactionCrypto,
} from '../../../../../_internal';
import { SalesContractVersion } from '../../../../../hooks';
import {
	getERC1155CheckoutParams,
	useERC1155Checkout,
} from '../useERC1155Checkout';

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
	useOnSuccess: vi.fn(() => vi.fn()),
	useOnError: vi.fn(() => vi.fn()),
	useQuantity: vi.fn(() => 1),
	useBuyAnalyticsId: vi.fn(() => 'mock-analytics-id'),
	useBuyModalProps: vi.fn(() => ({
		chainId: 1,
		collectionAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		marketplaceType: 'shop',
		salesContractAddress: '0x1234567890123456789012345678901234567890',
		items: [],
		quantityDecimals: 0,
		quantityRemaining: 100,
		salePrice: {
			amount: '1000000000000000000',
			currencyAddress: '0x0000000000000000000000000000000000000000',
		},
	})),
	isShopProps: vi.fn(() => true),
}));

const mockSalesContractAddress = '0x1234567890123456789012345678901234567890';
const mockCollectionAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
const mockPrice = '1000000000000000000'; // 1 ETH in wei

describe('getERC1155CheckoutParams', () => {
	it('should generate correct checkout parameters', async () => {
		const mockCallbacks = {
			onSuccess: vi.fn(),
			onError: vi.fn(),
		};
		const params = {
			accountAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			tokenIds: ['1'],
			amounts: ['1'],
			salePrice: {
				amount: '1000000000000000000',
				currencyAddress:
					'0x0000000000000000000000000000000000000000' as Address,
			},
			totalPrice: BigInt(mockPrice),
			chainId: 1,
			salesContractAddress: mockSalesContractAddress as Address,
			collectionAddress: mockCollectionAddress as Address,
			items: [{ tokenId: '1', quantity: '1' }],
			checkoutOptions: undefined,
			customCreditCardProviderCallback: undefined,
			quantity: 1,
			saleAnalyticsId: '1',
			transakContractId: undefined,
			enabled: true,
			callbacks: mockCallbacks,
			successActionButtons: [],
			salesContractVersion: SalesContractVersion.V0,
			creditCardProviders: [],
		};

		const result = await getERC1155CheckoutParams(params);

		expect(result).toMatchObject({
			chain: 1,
			contractAddress: '0x1234567890123456789012345678901234567890',
			collectionAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			items: [{ tokenId: '1', quantity: '1' }],
			wallet: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			customProviderCallback: undefined,
			supplementaryAnalyticsInfo: {
				marketplaceType: 'shop',
				saleAnalyticsId: '1',
			},
			successActionButtons: [],
			creditCardProviders: [],
		});
		expect(result.contractAddress).toBeDefined();
		expect(typeof result.contractAddress).toBe('string');
		expect(result.contractAddress).toMatch(/^0x/);
		expect(result.onSuccess).toBeInstanceOf(Function);
		expect(result.onClose).toBeInstanceOf(Function);
	});
});

describe('useERC1155Checkout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should return pending state initially', () => {
		const mockCheckoutOptions = {
			nftCheckout: [],
			swap: [],
			onRamp: [],
			crypto: TransactionCrypto.all,
		} as CheckoutOptions;
		const { result } = renderHook(() =>
			useERC1155Checkout({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [{ tokenId: '1', quantity: '1' }],
				callbacks: {
					onSuccess: vi.fn(),
					onError: vi.fn(),
				},
				successActionButtons: [],
				chainId: 1,
				checkoutOptions: mockCheckoutOptions,
			}),
		);

		expect(result.current.isPending).toBe(true);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle skipToken when disabled', () => {
		const mockCheckoutOptions = {
			nftCheckout: [],
			swap: [],
			onRamp: [],
			crypto: TransactionCrypto.all,
		} as CheckoutOptions;
		const { result } = renderHook(() =>
			useERC1155Checkout({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				checkoutOptions: mockCheckoutOptions,
				items: [{ tokenId: '1', quantity: '1' }],
				callbacks: {
					onSuccess: vi.fn(),
					onError: vi.fn(),
				},
				successActionButtons: [],
				chainId: 1,
			}),
		);

		// Should not be loading when disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should not fetch when wallet is not connected', async () => {
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

		const mockCheckoutOptions = {
			nftCheckout: [],
			swap: [],
			onRamp: [],
			crypto: TransactionCrypto.all,
		} as CheckoutOptions;
		const { result } = renderHook(() =>
			useERC1155Checkout({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [{ tokenId: '1', quantity: '1' }],
				callbacks: {
					onSuccess: vi.fn(),
					onError: vi.fn(),
				},
				successActionButtons: [],
				chainId: 1,
				checkoutOptions: mockCheckoutOptions,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should not fetch when required parameters are missing', () => {
		const mockCheckoutOptions = {
			nftCheckout: [],
			swap: [],
			onRamp: [],
			crypto: TransactionCrypto.all,
		} as CheckoutOptions;
		const { result } = renderHook(() =>
			useERC1155Checkout({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				items: [{ tokenId: '1', quantity: '1' }],
				callbacks: {
					onSuccess: vi.fn(),
					onError: vi.fn(),
				},
				successActionButtons: [],
				chainId: 1,
				checkoutOptions: mockCheckoutOptions,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
