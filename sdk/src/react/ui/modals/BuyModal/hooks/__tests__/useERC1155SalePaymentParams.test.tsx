import type { Address } from '@0xsequence/api-client';
import { renderHook } from '@test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ERC1155_SALES_CONTRACT_ABI_V0 } from '../../../../../../utils/abi';
import {
	getERC1155SalePaymentParams,
	useERC1155SalePaymentParams,
} from '../useERC1155SalePaymentParams';

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
	useQuantity: vi.fn(() => 1),
	useBuyModalProps: vi.fn(() => ({
		chainId: 1,
		collectionAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		marketplaceType: 'shop',
		salesContractAddress: '0x1234567890123456789012345678901234567890',
		item: { tokenId: undefined, quantity: undefined },
		quantityDecimals: 0,
		quantityRemaining: 100,
		salePrice: {
			amount: '1000000000000000000',
			currencyAddress: '0x0000000000000000000000000000000000000000',
		},
		successActionButtons: undefined,
		onRampProvider: undefined,
	})),
	useBuyAnalyticsId: vi.fn(() => undefined),
	buyModalStore: {
		send: vi.fn(),
	},
}));

// Mock useSalesContractABI hook
vi.mock('../../../../../hooks/contracts/useSalesContractABI', () => ({
	useSalesContractABI: vi.fn(() => ({
		abi: ERC1155_SALES_CONTRACT_ABI_V0,
		isLoading: false,
		version: 'v0',
	})),
}));

const mockSalesContractAddress = '0x1234567890123456789012345678901234567890';
const mockCollectionAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
const mockTokenId = '1';
const mockPrice = '1000000000000000000'; // 1 ETH in wei
const mockCurrencyAddress = '0x0000000000000000000000000000000000000000'; // ETH

// TODO: Write proper tests for getERC1155SalePaymentParams
describe.skip('getERC1155SalePaymentParams', () => {
	it('should generate correct payment parameters', async () => {
		const params = {
			chainId: 1,
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			salesContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			tokenId: mockTokenId,
			quantity: 1,
			price: BigInt(mockPrice),
			currencyAddress: mockCurrencyAddress,
			customCreditCardProviderCallback: undefined,
			skipNativeBalanceCheck: false,
			nativeTokenAddress: undefined,
			checkoutProvider: undefined,
			successActionButtons: undefined,
			onRampProvider: undefined,
			saleAnalyticsId: undefined,
			abi: ERC1155_SALES_CONTRACT_ABI_V0,
		};

		const result = await getERC1155SalePaymentParams(params);

		expect(result).toMatchObject({
			chain: 1,
			collectibles: [
				{
					quantity: '1',
					decimals: 0,
					tokenId: mockTokenId,
				},
			],
			currencyAddress: mockCurrencyAddress,
			price: mockPrice,
			targetContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			recipientAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			creditCardProviders: [],
		});

		expect(result.txData).toBeDefined();
		expect(typeof result.txData).toBe('string');
		expect(result.txData).toMatch(/^0x/);
		expect(result.onClose).toBeInstanceOf(Function);
	});

	it('should handle custom checkout provider', async () => {
		const params = {
			chainId: 1,
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			salesContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			tokenId: mockTokenId,
			quantity: 1,
			price: BigInt(mockPrice),
			currencyAddress: mockCurrencyAddress,
			customCreditCardProviderCallback: undefined,
			skipNativeBalanceCheck: false,
			nativeTokenAddress: undefined,
			checkoutProvider: 'stripe',
			successActionButtons: undefined,
			onRampProvider: undefined,
			saleAnalyticsId: undefined,
			abi: ERC1155_SALES_CONTRACT_ABI_V0,
		};

		const result = await getERC1155SalePaymentParams(params);
		expect(result.creditCardProviders).toEqual(['stripe']);
	});

	it('should handle custom credit card provider callback', async () => {
		const customCallback = vi.fn();
		const params = {
			chainId: 1,
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			salesContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			tokenId: mockTokenId,
			quantity: 1,
			price: BigInt(mockPrice),
			currencyAddress: mockCurrencyAddress,
			customCreditCardProviderCallback: customCallback,
			skipNativeBalanceCheck: false,
			nativeTokenAddress: undefined,
			checkoutProvider: undefined,
			successActionButtons: undefined,
			onRampProvider: undefined,
			saleAnalyticsId: undefined,
			abi: ERC1155_SALES_CONTRACT_ABI_V0,
		};

		const result = await getERC1155SalePaymentParams(params);
		expect(result.creditCardProviders).toEqual(['custom']);
		expect(result.customProviderCallback).toBeInstanceOf(Function);
	});

	it('should handle multiple quantities', async () => {
		const params = {
			chainId: 1,
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			salesContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			tokenId: mockTokenId,
			quantity: 5,
			price: BigInt(mockPrice),
			currencyAddress: mockCurrencyAddress,
			customCreditCardProviderCallback: undefined,
			skipNativeBalanceCheck: false,
			nativeTokenAddress: undefined,
			checkoutProvider: undefined,
			successActionButtons: undefined,
			onRampProvider: undefined,
			saleAnalyticsId: undefined,
			abi: ERC1155_SALES_CONTRACT_ABI_V0,
		};

		const result = await getERC1155SalePaymentParams(params);
		expect(result.collectibles[0].quantity).toBe('5');
		expect(result.collectibles[0].tokenId).toBe(mockTokenId);
	});

	it('should calculate total price correctly for multiple quantities', async () => {
		const params = {
			chainId: 1,
			address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
			salesContractAddress: mockSalesContractAddress,
			collectionAddress: mockCollectionAddress,
			tokenId: mockTokenId,
			quantity: 3,
			price: BigInt(mockPrice),
			currencyAddress: mockCurrencyAddress,
			customCreditCardProviderCallback: undefined,
			skipNativeBalanceCheck: false,
			nativeTokenAddress: undefined,
			checkoutProvider: undefined,
			successActionButtons: undefined,
			onRampProvider: undefined,
			saleAnalyticsId: undefined,
			abi: ERC1155_SALES_CONTRACT_ABI_V0,
		};

		const result = await getERC1155SalePaymentParams(params);
		// The price in the result is per-item price, total is calculated in the component
		expect(result.price).toBe(mockPrice);
		expect(result.collectibles[0].quantity).toBe('3');
	});
});

describe.skip('useERC1155SalePaymentParams', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should return loading state initially', () => {
		const { result } = renderHook(() =>
			useERC1155SalePaymentParams({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				tokenId: mockTokenId,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: true,
				chainId: 1,
			}),
		);

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle skipToken when disabled', () => {
		const { result } = renderHook(() =>
			useERC1155SalePaymentParams({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				tokenId: mockTokenId,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: false,
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

		const { result } = renderHook(() =>
			useERC1155SalePaymentParams({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				tokenId: mockTokenId,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: true,
				chainId: 1,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should not fetch when required parameters are missing', () => {
		const { result } = renderHook(() =>
			useERC1155SalePaymentParams({
				salesContractAddress: undefined,
				collectionAddress: mockCollectionAddress,
				tokenId: mockTokenId,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: true,
				chainId: 1,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should not fetch when tokenId is missing', () => {
		const { result } = renderHook(() =>
			useERC1155SalePaymentParams({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				tokenId: undefined,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: true,
				chainId: 1,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should not fetch when quantity is not set', async () => {
		const { useQuantity } = vi.mocked(await import('../../store'));
		useQuantity.mockReturnValue(undefined as never);

		const { result } = renderHook(() =>
			useERC1155SalePaymentParams({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				tokenId: mockTokenId,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: true,
				chainId: 1,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should not fetch when ABI is loading', async () => {
		const { useSalesContractABI } = vi.mocked(
			await import('../../../../../hooks/contracts/useSalesContractABI'),
		);
		useSalesContractABI.mockReturnValue({
			abi: null,
			isLoading: true,
			version: null,
		} as never);

		const { result } = renderHook(() =>
			useERC1155SalePaymentParams({
				salesContractAddress: mockSalesContractAddress,
				collectionAddress: mockCollectionAddress,
				tokenId: mockTokenId,
				price: mockPrice,
				currencyAddress: mockCurrencyAddress,
				enabled: true,
				chainId: 1,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
