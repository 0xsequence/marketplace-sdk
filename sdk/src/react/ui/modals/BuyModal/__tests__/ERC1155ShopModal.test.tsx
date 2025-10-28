import { ResourceStatus } from '@0xsequence/metadata';
import { render, screen, waitFor } from '@test';
import { USDC_ADDRESS } from '@test/const';
import type { Address } from 'viem';
import type { Mock, MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionCrypto } from '../../../../_internal';
import type { DatabeatAnalytics } from '../../../../_internal/databeat';
import { ERC1155ShopModal } from '../components/ERC1155ShopModal';
import * as useERC1155CheckoutModule from '../hooks/useERC1155Checkout';
import { buyModalStore } from '../store';

// Mock the checkout hook
vi.mock('../hooks/useERC1155Checkout');

const mockAnalyticsFn = {
	trackBuyModalOpened: vi.fn(),
} as unknown as DatabeatAnalytics;

const mockCollection = {
	address: '0x123' as Address,
	chainId: 1,
	name: 'Test Collection',
	type: 'ERC1155' as const,
	symbol: 'TEST',
	source: 'sequence-builder' as const,
	status: ResourceStatus.AVAILABLE,
	logoURI: 'https://example.com/logo.png',
	deployed: true,
	extensions: {},
	updatedAt: '2023-01-01T00:00:00Z',
	decimals: undefined,
	bytecodeHash: '0xabcdef123456789',
};

const mockShopData = {
	salesContractAddress: '0x456',
	items: [
		{ tokenId: '1', quantity: '2' },
		{ tokenId: '2', quantity: '1' },
	],
	salePrice: {
		amount: '1000000000000000000',
		currencyAddress: USDC_ADDRESS,
	},
	checkoutOptions: {
		crypto: TransactionCrypto.all,
		swap: [],
		nftCheckout: [],
		onRamp: [],
	},
};

describe('ERC1155ShopModal', () => {
	let mockOpenCheckoutModal: Mock;
	let mockUseERC1155Checkout: MockInstance;

	beforeEach(() => {
		vi.clearAllMocks();
		// Reset store state
		buyModalStore.send({ type: 'close' });

		// Setup default mock for useERC1155Checkout
		mockOpenCheckoutModal = vi.fn();
		mockUseERC1155Checkout = vi.spyOn(
			useERC1155CheckoutModule,
			'useERC1155Checkout',
		);

		// Initialize BuyModal props
		buyModalStore.send({
			type: 'open',
			props: {
				chainId: 1,
				collectionAddress: mockCollection.address,
				salesContractAddress: mockShopData.salesContractAddress as Address,
				items: mockShopData.items,
				quantityDecimals: 0,
				quantityRemaining: 10,
				salePrice: {
					amount: mockShopData.salePrice.amount,
					currencyAddress: mockShopData.salePrice.currencyAddress as Address,
				},
				cardType: 'shop',
			},
			analyticsFn: mockAnalyticsFn,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should show quantity modal initially', async () => {
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				chainId={1}
			/>,
		);

		expect(screen.getByText('Select Quantity')).toBeInTheDocument();
	});

	it('should open checkout modal after quantity is selected', async () => {
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				chainId={1}
			/>,
		);

		// Set quantity in store
		buyModalStore.send({ type: 'setQuantity', quantity: 2 });

		// Wait for checkout modal to be opened
		await waitFor(() => {
			expect(mockOpenCheckoutModal).toHaveBeenCalled();
		});

		// Check store state was updated
		expect(buyModalStore.getSnapshot().context.checkoutModalState).toBe('open');
	});

	it('should show loading modal when checkout is loading', async () => {
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: true,
			isError: false,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		// Set quantity in store before rendering
		buyModalStore.send({ type: 'setQuantity', quantity: 2 });

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				chainId={1}
			/>,
		);

		expect(screen.getByText('Loading payment options')).toBeInTheDocument();
		expect(mockOpenCheckoutModal).not.toHaveBeenCalled();
	});

	it('should render nothing when checkout is in error state', () => {
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: true,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		// Set quantity in store before rendering
		buyModalStore.send({ type: 'setQuantity', quantity: 2 });

		const { container } = render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				chainId={1}
			/>,
		);

		expect(container.firstChild).toBeNull();
		expect(mockOpenCheckoutModal).not.toHaveBeenCalled();
	});

	it('should not open checkout modal when not enabled', () => {
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: false,
			checkoutParams: {} as never,
		});

		// Set quantity in store before rendering
		buyModalStore.send({ type: 'setQuantity', quantity: 2 });

		const { container } = render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				chainId={1}
			/>,
		);

		expect(container.firstChild).toBeNull();
		expect(mockOpenCheckoutModal).not.toHaveBeenCalled();
	});

	it('should pass correct props to useERC1155Checkout hook', () => {
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		// Set quantity in store before rendering
		buyModalStore.send({ type: 'setQuantity', quantity: 2 });

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				chainId={1}
			/>,
		);

		expect(mockUseERC1155Checkout).toHaveBeenCalledWith({
			chainId: 1,
			salesContractAddress: '0x456',
			collectionAddress: '0x123',
			items: mockShopData.items.map((item) => ({
				...item,
				quantity: '2', // This comes from the store's quantity
			})),
			checkoutOptions: mockShopData.checkoutOptions,
			customProviderCallback: undefined,
			enabled: true,
		});
	});

	it('should handle missing tokenId and quantity gracefully', () => {
		const shopDataWithMissingProps = {
			...mockShopData,
			items: [
				{}, // No tokenId or quantity
				{ tokenId: '2' }, // No quantity
			],
		};

		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		// Set quantity in store before rendering
		buyModalStore.send({ type: 'setQuantity', quantity: 2 });

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={shopDataWithMissingProps}
				chainId={1}
			/>,
		);

		expect(mockUseERC1155Checkout).toHaveBeenCalledWith({
			chainId: 1,
			salesContractAddress: '0x456',
			collectionAddress: '0x123',
			items: shopDataWithMissingProps.items.map((item) => ({
				tokenId: item.tokenId ?? '0',
				quantity: '2', // This comes from the store's quantity
			})),
			checkoutOptions: mockShopData.checkoutOptions,
			customProviderCallback: undefined,
			enabled: true,
		});
	});

	it('should only open checkout modal once when state is idle', async () => {
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		// Set quantity in store before rendering
		buyModalStore.send({ type: 'setQuantity', quantity: 2 });

		const { rerender } = render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				chainId={1}
			/>,
		);

		// Wait for initial checkout modal open
		await waitFor(() => {
			expect(mockOpenCheckoutModal).toHaveBeenCalledTimes(1);
		});

		// Re-render component
		rerender(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				chainId={1}
			/>,
		);

		// Should not open modal again
		await waitFor(() => {
			expect(mockOpenCheckoutModal).toHaveBeenCalledTimes(1);
		});
	});

	it('should handle checkout options being undefined', () => {
		const shopDataWithoutCheckoutOptions = {
			...mockShopData,
			checkoutOptions: undefined,
		};

		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		// Set quantity in store before rendering
		buyModalStore.send({ type: 'setQuantity', quantity: 2 });

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={shopDataWithoutCheckoutOptions}
				chainId={1}
			/>,
		);

		expect(mockUseERC1155Checkout).toHaveBeenCalledWith(
			expect.objectContaining({
				checkoutOptions: undefined,
			}),
		);
	});

	it('should show loading modal with correct chain ID', () => {
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: true,
			isError: false,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		// Set quantity in store before rendering
		buyModalStore.send({ type: 'setQuantity', quantity: 2 });

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				chainId={137}
			/>,
		);

		expect(screen.getByText('Loading payment options')).toBeInTheDocument();
		expect(mockUseERC1155Checkout).toHaveBeenCalledWith(
			expect.objectContaining({
				chainId: 137,
			}),
		);
	});
});
