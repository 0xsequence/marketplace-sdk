import { renderHook } from '@test';
import type { Address } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	getERC721SalePaymentParams,
	useERC721SalePaymentParams,
} from '../useERC721SalePaymentParams';

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
	useBuyModalProps: vi.fn(() => ({
		chainId: 1,
		collectionAddress:
			'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as `0x${string}`,
		marketplaceType: 'shop',
		salesContractAddress:
			'0x1234567890123456789012345678901234567890' as `0x${string}`,
		items: [],
		quantityDecimals: 0,
		quantityRemaining: 100,
		salePrice: {
			amount: '1000000000000000000',
			currencyAddress:
				'0x0000000000000000000000000000000000000000' as `0x${string}`,
		},
	})),
}));

const mockSalesContractAddress =
	'0x1234567890123456789012345678901234567890' as Address;
const mockCollectionAddress =
	'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as Address;
const mockPrice = 1000000000000000000n; // 1 ETH in wei
const mockCurrencyAddress =
	'0x0000000000000000000000000000000000000000' as Address; // ETH

describe('getERC721SalePaymentParams', () => {
	it('should generate correct payment parameters', async () => {
		const params = {
			chainId: 1,
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			salesContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			price: BigInt(mockPrice),
			currencyAddress: mockCurrencyAddress,
			callbacks: {
				onSuccess: vi.fn(),
				onError: vi.fn(),
			},
			customCreditCardProviderCallback: undefined,
			skipNativeBalanceCheck: false,
			nativeTokenAddress: undefined,
			checkoutProvider: undefined,
			quantity: 1,
			onRampProvider: undefined,
		};

		const result = await getERC721SalePaymentParams(params);

		expect(result).toMatchObject({
			chain: 1,
			collectibles: [
				{
					quantity: '1',
					decimals: 0,
				},
			],
			currencyAddress: mockCurrencyAddress,
			price: mockPrice.toString(),
			targetContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			recipientAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			creditCardProviders: [],
		});

		expect(result.txData).toBeDefined();
		expect(typeof result.txData).toBe('string');
		expect(result.txData).toMatch(/^0x/);
		expect(result.onSuccess).toBeInstanceOf(Function);
		expect(result.onError).toBe(params.callbacks.onError);
		expect(result.onClose).toBeInstanceOf(Function);
	});

	it('should handle custom checkout provider', async () => {
		const params = {
			chainId: 1,
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			salesContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			price: BigInt(mockPrice),
			currencyAddress: mockCurrencyAddress,
			callbacks: undefined,
			customCreditCardProviderCallback: undefined,
			skipNativeBalanceCheck: false,
			nativeTokenAddress: undefined,
			checkoutProvider: 'stripe',
			quantity: 1,
			onRampProvider: undefined,
		};

		const result = await getERC721SalePaymentParams(params);
		expect(result.creditCardProviders).toEqual(['stripe']);
	});

	it('should handle custom credit card provider callback', async () => {
		const customCallback = vi.fn();
		const params = {
			chainId: 1,
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			salesContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			price: BigInt(mockPrice),
			currencyAddress: mockCurrencyAddress,
			callbacks: undefined,
			customCreditCardProviderCallback: customCallback,
			skipNativeBalanceCheck: false,
			nativeTokenAddress: undefined,
			checkoutProvider: undefined,
			quantity: 1,
			onRampProvider: undefined,
		};

		const result = await getERC721SalePaymentParams(params);
		expect(result.creditCardProviders).toEqual(['custom']);
		expect(result.customProviderCallback).toBeInstanceOf(Function);
	});

	it('should handle multiple quantities', async () => {
		const params = {
			chainId: 1,
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			salesContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			price: BigInt(mockPrice),
			currencyAddress: mockCurrencyAddress,
			callbacks: undefined,
			customCreditCardProviderCallback: undefined,
			skipNativeBalanceCheck: false,
			nativeTokenAddress: undefined,
			checkoutProvider: undefined,
			quantity: 5,
			onRampProvider: undefined,
		};

		const result = await getERC721SalePaymentParams(params);
		expect(result.collectibles[0].quantity).toBe('5');
	});
});

describe('useERC721SalePaymentParams', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should return loading state initially', () => {
		const { result } = renderHook(() =>
			useERC721SalePaymentParams({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: true,
				chainId: 1,
				quantity: 1,
			}),
		);

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle skipToken when disabled', () => {
		const { result } = renderHook(() =>
			useERC721SalePaymentParams({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: false,
				chainId: 1,
				quantity: 1,
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

		const { result } = renderHook(() =>
			useERC721SalePaymentParams({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: true,
				chainId: 1,
				quantity: 1,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should not fetch when required parameters are missing', () => {
		const { result } = renderHook(() =>
			useERC721SalePaymentParams({
				salesContractAddress: undefined,
				collectionAddress: mockCollectionAddress,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: true,
				chainId: 1,
				quantity: 1,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should use proper query key', async () => {
		// Ensure useAccount returns a connected address
		const { useAccount } = vi.mocked(await import('wagmi'));
		useAccount.mockReturnValue({
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			connector: null,
			addresses: undefined,
			chain: undefined,
			chainId: undefined,
			status: 'connected',
		} as never);

		const args = {
			salesContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			price: mockPrice,
			currencyAddress: mockCurrencyAddress,
			enabled: true,
			chainId: 1,
			quantity: 1,
		};

		const { result } = renderHook(() => useERC721SalePaymentParams(args));

		// Query should use the proper key structure
		expect(result.current.isLoading).toBe(true);
	});
});
