import { ResourceStatus } from '@0xsequence/metadata';
import { render, screen, waitFor } from '@test';
import type { Address } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CurrencyStatus, TransactionCrypto } from '../../../../_internal';
import { ERC1155ShopModal } from '../components/ERC1155ShopModal';
import * as useERC1155CheckoutModule from '../hooks/useERC1155Checkout';
import { buyModalStore } from '../store';

// Mock the checkout hook
vi.mock('../hooks/useERC1155Checkout');

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

const mockCurrency = {
	chainId: 1,
	contractAddress: '0x0' as Address,
	symbol: 'ETH',
	name: 'Ethereum',
	decimals: 18,
	imageUrl: 'https://example.com/eth.png',
	status: CurrencyStatus.active,
	nativeToken: true,
	disableSwap: false,
	disableSwapIntoNativeToken: false,
	exchangeRate: 1,
	defaultChainCurrency: true,
	nativeCurrency: true,
	createdAt: '2023-01-01T00:00:00Z',
	updatedAt: '2023-01-01T00:00:00Z',
};

const mockShopData = {
	salesContractAddress: '0x456',
	items: [
		{ tokenId: '1', quantity: '2' },
		{ tokenId: '2', quantity: '1' },
	],
	salePrice: {
		amount: '1000000000000000000',
		currencyAddress: '0x0',
	},
	checkoutOptions: {
		crypto: TransactionCrypto.all,
		swap: [],
		nftCheckout: [],
		onRamp: [],
	},
};

describe('ERC1155ShopModal', () => {
	let mockOpenCheckoutModal: ReturnType<typeof vi.fn>;
	// biome-ignore lint/suspicious/noExplicitAny: Required for mock typing in tests
	let mockUseERC1155Checkout: any;

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
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should open checkout modal when data is loaded and enabled', async () => {
		// Mock successful checkout hook
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
				currency={mockCurrency}
				chainId={1}
			/>,
		);

		// Wait for checkout modal to be opened
		await waitFor(() => {
			expect(mockOpenCheckoutModal).toHaveBeenCalled();
		});

		// Check store state was updated
		expect(buyModalStore.getSnapshot().context.checkoutModalState).toBe('open');
	});

	it('should show loading modal when checkout is loading', () => {
		// Mock loading state
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: true,
			isError: false,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				currency={mockCurrency}
				chainId={1}
			/>,
		);

		expect(screen.getByText('Loading Sequence Pay')).toBeInTheDocument();
		expect(mockOpenCheckoutModal).not.toHaveBeenCalled();
	});

	it('should render nothing when checkout is in error state', () => {
		// Mock error state
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: true,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		const { container } = render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				currency={mockCurrency}
				chainId={1}
			/>,
		);

		expect(container.firstChild).toBeNull();
		expect(mockOpenCheckoutModal).not.toHaveBeenCalled();
	});

	it('should not open checkout modal when not enabled', () => {
		// Mock disabled state
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: false,
			checkoutParams: {} as never,
		});

		const { container } = render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				currency={mockCurrency}
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

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				currency={mockCurrency}
				chainId={1}
			/>,
		);

		expect(mockUseERC1155Checkout).toHaveBeenCalledWith({
			chainId: 1,
			salesContractAddress: '0x456',
			collectionAddress: '0x123',
			items: [
				{ tokenId: '1', quantity: '2' },
				{ tokenId: '2', quantity: '1' },
			],
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

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={shopDataWithMissingProps}
				currency={mockCurrency}
				chainId={1}
			/>,
		);

		// Check that defaults were applied
		expect(mockUseERC1155Checkout).toHaveBeenCalledWith({
			chainId: 1,
			salesContractAddress: '0x456',
			collectionAddress: '0x123',
			items: [
				{ tokenId: '0', quantity: '1' },
				{ tokenId: '2', quantity: '1' },
			],
			checkoutOptions: mockShopData.checkoutOptions,
			customProviderCallback: undefined,
			enabled: true,
		});
	});

	it('should disable checkout when sales contract address is missing', () => {
		const shopDataWithoutContract = {
			...mockShopData,
			salesContractAddress: '',
		};

		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: false,
			checkoutParams: {} as never,
		});

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={shopDataWithoutContract}
				currency={mockCurrency}
				chainId={1}
			/>,
		);

		expect(mockUseERC1155Checkout).toHaveBeenCalledWith(
			expect.objectContaining({
				salesContractAddress: '',
				enabled: false,
			}),
		);
	});

	it('should pass empty items array to useERC1155Checkout when items array is empty', () => {
		const shopDataWithoutItems = {
			...mockShopData,
			items: [],
		};

		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: false,
			checkoutParams: {} as never,
		});

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={shopDataWithoutItems}
				currency={mockCurrency}
				chainId={1}
			/>,
		);

		expect(mockUseERC1155Checkout).toHaveBeenCalledWith(
			expect.objectContaining({
				items: [],
				enabled: true, // Component still passes true, but useERC1155Checkout can decide based on empty items
			}),
		);
	});

	it('should only open checkout modal once when state is idle', async () => {
		mockUseERC1155Checkout.mockReturnValue({
			openCheckoutModal: mockOpenCheckoutModal,
			isLoading: false,
			isError: false,
			isEnabled: true,
			checkoutParams: {} as never,
		});

		const { rerender } = render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				currency={mockCurrency}
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
				currency={mockCurrency}
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

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={shopDataWithoutCheckoutOptions}
				currency={mockCurrency}
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

		render(
			<ERC1155ShopModal
				collection={mockCollection}
				shopData={mockShopData}
				currency={mockCurrency}
				chainId={137}
			/>,
		);

		// Check that LoadingModal received the correct chainId prop
		expect(screen.getByText('Loading Sequence Pay')).toBeInTheDocument();
		expect(mockUseERC1155Checkout).toHaveBeenCalledWith(
			expect.objectContaining({
				chainId: 137,
			}),
		);
	});
});
