import { useSelectPaymentModal } from '@0xsequence/checkout';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	MarketplaceKind,
	WalletKind,
} from '../../../../../_internal/api/marketplace.gen';
import { TransactionCrypto } from '../../../../../_internal/api/marketplace.gen';
import { getMarketplaceClient } from '../../../../../_internal/api/services';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import { useConfig } from '../../../../../hooks';
import { useBuyCollectable } from '../useBuyCollectable';
import { useFees } from '../useFees';

// Mock dependencies
vi.mock('@0xsequence/checkout', () => ({
	useSelectPaymentModal: vi.fn(),
}));

vi.mock('../../../../../_internal/wallet/useWallet', () => ({
	useWallet: vi.fn(),
}));

vi.mock('../../../../../hooks', () => ({
	useConfig: vi.fn(),
}));

vi.mock('../useFees', () => ({
	useFees: vi.fn(),
}));

vi.mock('../../../../../_internal', (actualImport) => {
	const actualModule = actualImport();
	return {
		getMarketplaceClient: vi.fn(),
		...actualModule,
	};
});

describe('useBuyCollectable', () => {
	const defaultProps = {
		chainId: '1',
		collectionAddress: '0x123',
		tokenId: '1',
		priceCurrencyAddress: '0x0',
		setCheckoutModalIsLoading: vi.fn(),
		setCheckoutModalLoaded: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup default mock implementations
		(
			useSelectPaymentModal as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue({
			openSelectPaymentModal: vi.fn(),
		});

		(useConfig as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			projectAccessKey: 'test-key',
			projectId: 'test-id',
		});

		(useFees as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			amount: '250',
			receiver: '0x123',
		});
	});

	it('should return loading state initially', () => {
		// Mock useWallet to return loading state
		(useWallet as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			wallet: null,
			isLoading: true,
			isError: false,
		});

		const { result } = renderHook(() => useBuyCollectable(defaultProps));

		expect(result.current).toEqual({
			status: 'loading',
			buy: null,
			isLoading: true,
			isError: false,
		});
	});

	it('should return error state when wallet is not available', () => {
		// Mock useWallet to return error state
		(useWallet as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			wallet: null,
			isLoading: false,
			isError: true,
		});

		const { result } = renderHook(() => useBuyCollectable(defaultProps));

		expect(result.current).toEqual({
			status: 'error',
			buy: null,
			isLoading: false,
			isError: true,
		});

		// Also test when wallet is undefined but no error
		(useWallet as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			wallet: undefined,
			isLoading: false,
			isError: false,
		});

		const { result: result2 } = renderHook(() =>
			useBuyCollectable(defaultProps),
		);

		expect(result2.current).toEqual({
			status: 'error',
			buy: null,
			isLoading: false,
			isError: true,
		});
	});

	it.skip('should call buy function with correct parameters', async () => {
		// Mock useWallet to return a valid wallet
		(useWallet as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			wallet: {
				kind: WalletKind.sequence,
				address: async () => '0x123',
				chainId: '1',
			},
			isLoading: false,
			isError: false,
		});

		const openSelectPaymentModalMock = vi.fn();
		(
			useSelectPaymentModal as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue({
			openSelectPaymentModal: openSelectPaymentModalMock,
		});

		const generateBuyTransactionMock = vi.fn().mockResolvedValue({
			steps: [
				{
					type: 'transaction',
					value: '1000000000000000000',
					to: '0x123',
					data: '0x456',
				},
			],
		});

		const marketplaceClientMock = {
			generateBuyTransaction: generateBuyTransactionMock,
		};

		(
			getMarketplaceClient as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue(marketplaceClientMock);

		const { result } = renderHook(() => useBuyCollectable(defaultProps));

		if (result.current.status === 'ready') {
			await result.current.buy({
				orderId: '1',
				quantity: '1',
				collectableDecimals: 18,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
				checkoutOptions: {
					swap: [],
					nftCheckout: [],
					onRamp: [],
					crypto: TransactionCrypto.all,
				},
			});
		}

		expect(generateBuyTransactionMock).toHaveBeenCalledWith({
			collectionAddress: defaultProps.collectionAddress,
			buyer: '0x123',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
			ordersData: [
				{
					orderId: '1',
					quantity: '1',
				},
			],
			additionalFees: [
				{
					amount: '250',
					receiver: '0x123',
				},
			],
			walletType: WalletKind.unknown,
		});

		expect(openSelectPaymentModalMock).toHaveBeenCalledWith({
			chain: defaultProps.chainId,
			collectibles: [
				{
					tokenId: defaultProps.tokenId,
					quantity: '1',
					decimals: 18,
				},
			],
			currencyAddress: defaultProps.priceCurrencyAddress,
			price: '1000000000000000000',
			targetContractAddress: '0x123',
			txData: '0x456',
			collectionAddress: defaultProps.collectionAddress,
			recipientAddress: '0x123',
			enableMainCurrencyPayment: true,
			enableSwapPayments: true,
			creditCardProviders: [],
			onSuccess: expect.any(Function),
			onError: undefined,
			onClose: expect.any(Function),
		});

		expect(defaultProps.setCheckoutModalIsLoading).toHaveBeenCalledWith(true);
		expect(defaultProps.setCheckoutModalLoaded).toHaveBeenCalledWith(true);
	});

	it.skip('should handle success callback', async () => {
		(useWallet as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			wallet: {
				kind: WalletKind.sequence,
				address: async () => '0x123',
				chainId: '1',
			},
			isLoading: false,
			isError: false,
		});

		const openSelectPaymentModalMock = vi.fn();
		(
			useSelectPaymentModal as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue({
			openSelectPaymentModal: openSelectPaymentModalMock,
		});

		// const generateBuyTransactionMock = vi.fn().mockResolvedValue({
		// 	steps: [
		// 		{
		// 			type: 'transaction',
		// 			value: '1000000000000000000',
		// 			to: '0x123',
		// 			data: '0x456',
		// 		},
		// 	],
		// });

		// const marketplaceClientMock = {
		// 	generateBuyTransaction: generateBuyTransactionMock,
		// };

		// (
		// 	getMarketplaceClient as unknown as ReturnType<typeof vi.fn>
		// ).mockReturnValue(marketplaceClientMock);

		const onSuccessMock = vi.fn();
		const props = {
			...defaultProps,
			callbacks: {
				onSuccess: onSuccessMock,
			},
		};

		const { result } = renderHook(() => useBuyCollectable(props));

		if (result.current.status === 'ready') {
			await result.current.buy({
				orderId: '1',
				quantity: '1',
				collectableDecimals: 18,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
				checkoutOptions: {
					swap: [],
					nftCheckout: [],
					onRamp: [],
					crypto: TransactionCrypto.all,
				},
			});
		}

		const onSuccessCallback =
			openSelectPaymentModalMock.mock.calls[0][0].onSuccess;

		const txHash = '0x789';
		await onSuccessCallback(txHash);

		expect(onSuccessMock).toHaveBeenCalledWith({ hash: txHash });
	});

	it.skip('should handle error callback', async () => {
		// Mock useWallet to return a valid wallet
		(useWallet as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			wallet: {
				kind: WalletKind.sequence,
				address: async () => '0x123',
				chainId: '1',
			},
			isLoading: false,
			isError: false,
		});

		const openSelectPaymentModalMock = vi.fn();
		(
			useSelectPaymentModal as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue({
			openSelectPaymentModal: openSelectPaymentModalMock,
		});

		const onErrorMock = vi.fn();
		const props = {
			...defaultProps,
			callbacks: {
				onError: onErrorMock,
			},
		};

		const { result } = renderHook(() => useBuyCollectable(props));

		if (result.current.status === 'ready') {
			await result.current.buy({
				orderId: '1',
				quantity: '1',
				collectableDecimals: 18,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
				checkoutOptions: {
					swap: [],
					nftCheckout: [],
					onRamp: [],
					crypto: TransactionCrypto.all,
				},
			});
		}

		const onErrorCallback = openSelectPaymentModalMock.mock.calls[0][0].onError;

		const error = new Error('Transaction failed');
		onErrorCallback(error);

		expect(onErrorMock).toHaveBeenCalledWith(error);
	});
});
