import { ResourceStatus } from '@0xsequence/metadata';
import { render, waitFor } from '@test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	TransactionCrypto,
	TransactionNFTCheckoutProvider,
} from '../../../../_internal';
import { ERC1155ShopModal } from '../components/ERC1155ShopModal';
import * as useERC1155CheckoutModule from '../hooks/useERC1155Checkout';
import { buyModalStore } from '../store';

// Mock the checkout hook from @0xsequence/checkout
vi.mock('@0xsequence/checkout', () => ({
	useERC1155SaleContractCheckout: vi.fn(() => ({
		openCheckoutModal: vi.fn(),
		isError: false,
		isLoading: false,
	})),
}));

// Mock the store hooks
vi.mock('../store', async () => {
	const actual = await vi.importActual('../store');
	return {
		...actual,
		useQuantity: vi.fn(() => 1),
		useBuyModalProps: vi.fn(() => ({
			successActionButtons: [],
			customCreditCardProviderCallback: undefined,
		})),
		useCheckoutModalState: vi.fn(() => 'idle'),
		useBuyAnalyticsId: vi.fn(() => 'test-analytics-id'),
		isShopProps: vi.fn(() => true),
	};
});

// Mock the quantity modal component
vi.mock('../components/ERC1155QuantityModal', () => ({
	ERC1155QuantityModal: vi.fn(
		({
			cardType,
			quantityDecimals,
			quantityRemaining,
			unlimitedSupply,
			chainId,
		}) => (
			<div data-testid="quantity-modal">
				<span data-testid="card-type">{cardType}</span>
				<span data-testid="quantity-decimals">{quantityDecimals}</span>
				<span data-testid="quantity-remaining">{quantityRemaining}</span>
				<span data-testid="unlimited-supply">{unlimitedSupply.toString()}</span>
				<span data-testid="chain-id">{chainId}</span>
			</div>
		),
	),
}));

// Mock the loading modal
vi.mock('../../_internal/components/actionModal/LoadingModal', () => ({
	LoadingModal: vi.fn(({ isOpen, chainId, title }) => (
		<div data-testid="loading-modal">
			<span data-testid="is-open">{isOpen.toString()}</span>
			<span data-testid="chain-id">{chainId}</span>
			<span data-testid="title">{title}</span>
		</div>
	)),
}));

const mockCollection = {
	address: '0x123' as `0x${string}`,
	chainId: 1,
	name: 'Test ERC1155 Collection',
	type: 'ERC1155' as const,
	symbol: 'TEST1155',
	source: 'https://example.com',
	status: ResourceStatus.AVAILABLE,
	deployed: true,
	updatedAt: new Date().toISOString(),
	bytecodeHash: '0x1234567890',
	extensions: {
		description: 'Test ERC1155 Collection',
		link: 'https://example.com',
		ogImage: 'https://example.com/image.png',
		ogName: 'Test ERC1155 Collection',
		originAddress: '0x0000000000000000000000000000000000000000',
		originChainId: 1,
		verified: true,
		categories: ['Test'],
		blacklist: false,
		verifiedBy: '0x',
		featured: false,
		featureIndex: 0,
	},
	logoURI: 'https://example.com/logo.png',
};

const mockShopData = {
	salesContractAddress: '0x456',
	items: [{ tokenId: '1', quantity: '2' }],
	salePrice: {
		amount: '1000000000000000000',
		currencyAddress: '0x0',
	},
	checkoutOptions: {
		crypto: TransactionCrypto.all,
		swap: [],
		nftCheckout: [TransactionNFTCheckoutProvider.transak],
		onRamp: [],
	},
};

const mockCheckoutData = {
	chain: 1,
	contractAddress: '0x456',
	collectionAddress: '0x123',
	items: [{ tokenId: '1', quantity: '2' }],
	wallet: '0xabc',
	onSuccess: expect.any(Function),
	onError: expect.any(Function),
	onClose: expect.any(Function),
	supplementaryAnalyticsInfo: {
		marketplaceType: 'shop',
		saleAnalyticsId: 'test-analytics-id',
	},
	successActionButtons: [],
	creditCardProviders: [],
};

describe('ERC1155ShopModal', () => {
	let openCheckoutModalMock: ReturnType<typeof vi.fn>;
	let useQuantityMock: ReturnType<typeof vi.fn>;
	let useBuyModalPropsMock: ReturnType<typeof vi.fn>;
	let useCheckoutModalStateMock: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		vi.clearAllMocks();
		// Reset store state
		buyModalStore.send({ type: 'close' });

		// Setup the mock for useERC1155SaleContractCheckout
		const checkoutModule = await import('@0xsequence/checkout');
		const { useERC1155SaleContractCheckout } = vi.mocked(checkoutModule);
		openCheckoutModalMock = vi.fn();
		useERC1155SaleContractCheckout.mockReturnValue({
			openCheckoutModal: openCheckoutModalMock,
			isError: false,
			isLoading: false,
		} as never);

		// Setup store mocks
		const storeModule = await import('../store');
		useQuantityMock = vi.mocked(storeModule.useQuantity);
		useBuyModalPropsMock = vi.mocked(storeModule.useBuyModalProps);
		useCheckoutModalStateMock = vi.mocked(storeModule.useCheckoutModalState);

		// Default mock returns
		useQuantityMock.mockReturnValue(1);
		useBuyModalPropsMock.mockReturnValue({
			successActionButtons: [],
			customCreditCardProviderCallback: undefined,
		});
		useCheckoutModalStateMock.mockReturnValue('idle');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Quantity Modal Behavior', () => {
		it('should render ERC1155QuantityModal when no quantity is set', () => {
			// Mock no quantity
			useQuantityMock.mockReturnValue(null);
			useBuyModalPropsMock.mockReturnValue({
				successActionButtons: [],
				customCreditCardProviderCallback: undefined,
				quantityDecimals: 2,
				quantityRemaining: '100',
				unlimitedSupply: false,
			});

			const { getByTestId } = render(
				<ERC1155ShopModal
					collection={mockCollection}
					shopData={mockShopData}
					chainId={1}
				/>,
			);

			expect(getByTestId('quantity-modal')).toBeInTheDocument();
			expect(getByTestId('card-type')).toHaveTextContent('shop');
			expect(getByTestId('quantity-decimals')).toHaveTextContent('2');
			expect(getByTestId('quantity-remaining')).toHaveTextContent('100');
			expect(getByTestId('unlimited-supply')).toHaveTextContent('false');
			expect(getByTestId('chain-id')).toHaveTextContent('1');
		});
	});

	describe('Checkout Modal Behavior', () => {
		it('should open checkout modal with correct data when checkout data is loaded', async () => {
			// Mock successful checkout data loading
			vi.spyOn(useERC1155CheckoutModule, 'useERC1155Checkout').mockReturnValue({
				data: mockCheckoutData,
				isError: false,
			} as never);

			render(
				<ERC1155ShopModal
					collection={mockCollection}
					shopData={mockShopData}
					chainId={1}
				/>,
			);

			// Wait for checkout modal to be opened
			await waitFor(() => {
				expect(openCheckoutModalMock).toHaveBeenCalled();
			});

			// Check store state was updated
			expect(buyModalStore.getSnapshot().context.checkoutModalState).toBe(
				'open',
			);
		});

		it('should call useERC1155Checkout with correct parameters', () => {
			const mockUseERC1155Checkout = vi.spyOn(
				useERC1155CheckoutModule,
				'useERC1155Checkout',
			);
			mockUseERC1155Checkout.mockReturnValue({
				data: mockCheckoutData,
				isError: false,
			} as never);

			render(
				<ERC1155ShopModal
					collection={mockCollection}
					shopData={mockShopData}
					chainId={1}
				/>,
			);

			expect(mockUseERC1155Checkout).toHaveBeenCalledWith({
				chainId: 1,
				salesContractAddress: mockShopData.salesContractAddress,
				collectionAddress: mockCollection.address,
				items: mockShopData.items.map((item) => ({
					...item,
					tokenId: item.tokenId ?? '0',
					quantity: '1',
				})),
				checkoutOptions: mockShopData.checkoutOptions,
				customCreditCardProviderCallback: undefined,
				enabled: true,
				callbacks: {
					onSuccess: expect.any(Function),
					onError: expect.any(Function),
				},
				successActionButtons: [],
			});
		});

		it('should only open checkout modal once when state is idle', async () => {
			// Mock checkout modal state to return 'open' after first call to prevent re-opening
			let callCount = 0;
			useCheckoutModalStateMock.mockImplementation(() => {
				callCount++;
				return callCount === 1 ? 'idle' : 'open';
			});

			// Mock successful checkout data loading
			vi.spyOn(useERC1155CheckoutModule, 'useERC1155Checkout').mockReturnValue({
				data: mockCheckoutData,
				isError: false,
			} as never);

			const { rerender } = render(
				<ERC1155ShopModal
					collection={mockCollection}
					shopData={mockShopData}
					chainId={1}
				/>,
			);

			// Wait for initial checkout modal open
			await waitFor(() => {
				expect(openCheckoutModalMock).toHaveBeenCalledTimes(1);
			});

			// Re-render component
			rerender(
				<ERC1155ShopModal
					collection={mockCollection}
					shopData={mockShopData}
					chainId={1}
				/>,
			);

			// Should not open modal again since state is now 'open'
			await waitFor(() => {
				expect(openCheckoutModalMock).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('Loading States', () => {
		it('should render loading modal when checkout is loading', async () => {
			const checkoutModule = await import('@0xsequence/checkout');
			const { useERC1155SaleContractCheckout } = vi.mocked(checkoutModule);
			useERC1155SaleContractCheckout.mockReturnValue({
				openCheckoutModal: openCheckoutModalMock,
				isError: false,
				isLoading: true,
			} as never);

			vi.spyOn(useERC1155CheckoutModule, 'useERC1155Checkout').mockReturnValue({
				data: mockCheckoutData,
				isError: false,
			} as never);

			const { getByTestId } = render(
				<ERC1155ShopModal
					collection={mockCollection}
					shopData={mockShopData}
					chainId={1}
				/>,
			);

			expect(getByTestId('loading-modal')).toBeInTheDocument();
			expect(getByTestId('title')).toHaveTextContent('Loading checkout data');
		});
	});

	describe('Error Handling', () => {
		it('should handle error from useERC1155SaleContractCheckout', async () => {
			// Create a separate mock for this test that has an error
			const errorCheckoutModalMock = vi.fn();
			const checkoutModule = await import('@0xsequence/checkout');
			const { useERC1155SaleContractCheckout } = vi.mocked(checkoutModule);
			useERC1155SaleContractCheckout.mockReturnValueOnce({
				openCheckoutModal: errorCheckoutModalMock,
				isError: true,
				isLoading: false,
			} as never);

			vi.spyOn(useERC1155CheckoutModule, 'useERC1155Checkout').mockReturnValue({
				data: mockCheckoutData,
				isError: false,
			} as never);

			// Component should not open checkout modal when there's an error
			render(
				<ERC1155ShopModal
					collection={mockCollection}
					shopData={mockShopData}
					chainId={1}
				/>,
			);

			// Should not call openCheckoutModal when there's an error
			expect(errorCheckoutModalMock).not.toHaveBeenCalled();
		});
	});

	describe('Success Action Buttons', () => {
		it('should pass success action buttons to checkout', () => {
			const successActionButtons = [
				{ label: 'View on OpenSea', action: vi.fn() },
			];

			useBuyModalPropsMock.mockReturnValue({
				successActionButtons,
				customCreditCardProviderCallback: undefined,
			});

			const mockUseERC1155Checkout = vi.spyOn(
				useERC1155CheckoutModule,
				'useERC1155Checkout',
			);
			mockUseERC1155Checkout.mockReturnValue({
				data: mockCheckoutData,
				isError: false,
			} as never);

			render(
				<ERC1155ShopModal
					collection={mockCollection}
					shopData={mockShopData}
					chainId={1}
				/>,
			);

			expect(mockUseERC1155Checkout).toHaveBeenCalledWith(
				expect.objectContaining({
					successActionButtons,
				}),
			);
		});
	});
});
