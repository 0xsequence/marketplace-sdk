import { ResourceStatus } from '@0xsequence/marketplace-api';
import { render, screen } from '@test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	CurrencyStatus,
	MarketplaceKind,
	OrderSide,
	OrderStatus,
} from '../../../../_internal';
import type { DatabeatAnalytics } from '../../../../_internal/databeat';
import { BuyModalRouter } from '../components/BuyModalRouter';
import * as useLoadDataModule from '../hooks/useLoadData';
import { buyModalStore } from '../store';

// Mock the child components
vi.mock('../components/ERC721BuyModal', () => ({
	ERC721BuyModal: ({ chainId }: { chainId: number }) => (
		<div data-testid="erc721-buy-modal">ERC721 Buy Modal - Chain {chainId}</div>
	),
}));

vi.mock('../components/ERC721ShopModal', () => ({
	ERC721ShopModal: ({ chainId }: { chainId: number }) => (
		<div data-testid="erc721-shop-modal">
			ERC721 Shop Modal - Chain {chainId}
		</div>
	),
}));

vi.mock('../components/ERC1155BuyModal', () => ({
	ERC1155BuyModal: ({ chainId }: { chainId: number }) => (
		<div data-testid="erc1155-buy-modal">
			ERC1155 Buy Modal - Chain {chainId}
		</div>
	),
}));

vi.mock('../components/ERC1155ShopModal', () => ({
	ERC1155ShopModal: ({ chainId }: { chainId: number }) => (
		<div data-testid="erc1155-shop-modal">
			ERC1155 Shop Modal - Chain {chainId}
		</div>
	),
}));

// Mock data
const mockCollection721 = {
	type: 'ERC721' as const,
	name: 'Test Collection',
	address: '0x123' as `0x${string}`,
	chainId: 1,
	symbol: 'TEST',
	source: 'https://example.com',
	status: ResourceStatus.AVAILABLE,
	deployed: true,
	updatedAt: new Date().toISOString(),
	bytecodeHash: '0x1234567890',
	extensions: {
		description: 'Test Collection',
		link: 'https://example.com',
		ogImage: 'https://example.com/image.png',
		ogName: 'Test Collection',
		originAddress:
			'0x0000000000000000000000000000000000000000' as `0x${string}`,
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

const mockCollection1155 = {
	type: 'ERC1155' as const,
	name: 'Test Collection',
	address: '0x123' as `0x${string}`,
	chainId: 1,
	symbol: 'TEST',
	source: 'https://example.com',
	status: ResourceStatus.AVAILABLE,
	deployed: true,
	updatedAt: new Date().toISOString(),
	bytecodeHash: '0x1234567890',
	extensions: {
		description: 'Test Collection',
		link: 'https://example.com',
		ogImage: 'https://example.com/image.png',
		ogName: 'Test Collection',
		originAddress:
			'0x0000000000000000000000000000000000000000' as `0x${string}`,
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

const mockCollectable = {
	tokenId: 1n,
	name: 'Test Collectible',
	source: 'https://example.com',
	attributes: [],
	status: ResourceStatus.AVAILABLE,
};

const mockOrder = {
	orderId: '1',
	marketplace: MarketplaceKind.sequence_marketplace_v2,
	side: OrderSide.listing,
	status: OrderStatus.active,
	chainId: 1,
	originName: 'Test',
	slug: 'test-order',
	collectionContractAddress: '0x123' as `0x${string}`,
	tokenId: 1n,
	createdBy: '0xabc' as `0x${string}`,
	priceAmount: 1000000000000000000n,
	priceAmountFormatted: '1.0',
	priceAmountNet: 1000000000000000000n,
	priceAmountNetFormatted: '1.0',
	priceCurrencyAddress: '0x0' as `0x${string}`,
	priceDecimals: 18,
	priceUSD: 3000,
	priceUSDFormatted: '$3,000.00',
	quantityInitial: 1n,
	quantityInitialFormatted: '1',
	quantityRemaining: 1n,
	quantityRemainingFormatted: '1',
	quantityAvailable: 1n,
	quantityAvailableFormatted: '1',
	quantityDecimals: 0,
	feeBps: 250,
	feeBreakdown: [],
	validFrom: new Date().toISOString(),
	validUntil: new Date(Date.now() + 86400000).toISOString(),
	blockNumber: 1234567,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

const mockCheckoutOptions = {
	order: mockOrder,
	crypto: 'all' as const,
	swap: [] as string[],
	nftCheckout: [] as string[],
	onRamp: [] as string[],
} as never;

const mockCurrency = {
	chainId: 1,
	contractAddress:
		'0x0000000000000000000000000000000000000000' as `0x${string}`,
	status: CurrencyStatus.active,
	name: 'Ethereum',
	symbol: 'ETH',
	decimals: 18,
	imageUrl: 'https://example.com/eth.png',
	exchangeRate: 3000,
	defaultChainCurrency: true,
	nativeCurrency: true,
	openseaListing: true,
	openseaOffer: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

const mockShopData = {
	salesContractAddress: '0x456' as `0x${string}`,
	items: [{ tokenId: 1n, quantity: 1n } as any],
	salePrice: {
		amount: 1000000000000000000n,
		currencyAddress:
			'0x0000000000000000000000000000000000000000' as `0x${string}`,
	},
	checkoutOptions: undefined,
};

const mockAnalyticsFn = {
	trackBuyModalOpened: vi.fn(),
} as unknown as DatabeatAnalytics;

describe('BuyModalRouter', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		buyModalStore.send({ type: 'close' });
	});

	describe('Market Flow', () => {
		it('should render ERC721BuyModal for market flow with ERC721 collection', () => {
			// Initialize store with market props
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123',
					tokenId: 1n,
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
					cardType: 'market',
				},
				analyticsFn: mockAnalyticsFn,
			});

			// Mock useLoadData to return complete data for ERC721 market flow
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection721,
				collectable: mockCollectable,
				address: '0x1234567890123456789012345678901234567890',
				order: mockOrder,
				checkoutOptions: mockCheckoutOptions,
				currency: mockCurrency,
				shopData: undefined,
				isLoading: false,
				isError: false,
				error: null,
			});

			render(<BuyModalRouter />);

			expect(screen.getByTestId('erc721-buy-modal')).toBeInTheDocument();
			expect(
				screen.getByText('ERC721 Buy Modal - Chain 1'),
			).toBeInTheDocument();
		});

		it('should render ERC1155BuyModal for market flow with ERC1155 collection', () => {
			// Initialize store with market props
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123',
					tokenId: 1n,
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
					cardType: 'market',
				},
				analyticsFn: mockAnalyticsFn,
			});

			// Mock useLoadData to return complete data for ERC1155 market flow
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection1155,
				collectable: mockCollectable,
				address: '0x1234567890123456789012345678901234567890',
				order: mockOrder,
				checkoutOptions: mockCheckoutOptions,
				currency: mockCurrency,
				shopData: undefined,
				isLoading: false,
				isError: false,
				error: null,
			});

			render(<BuyModalRouter />);

			expect(screen.getByTestId('erc1155-buy-modal')).toBeInTheDocument();
			expect(
				screen.getByText('ERC1155 Buy Modal - Chain 1'),
			).toBeInTheDocument();
		});

		it('should show loading modal when data is incomplete for market flow', () => {
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123',
					tokenId: 1n,
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
				},
				analyticsFn: mockAnalyticsFn,
			});

			// Mock incomplete data
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection721,
				collectable: undefined, // Missing collectable
				address: '0x1234567890123456789012345678901234567890',
				order: mockOrder,
				checkoutOptions: mockCheckoutOptions,
				currency: mockCurrency,
				shopData: undefined,
				isLoading: false,
				isError: false,
				error: null,
			});

			render(<BuyModalRouter />);

			expect(screen.getByText('Loading payment options')).toBeInTheDocument();
		});
	});

	describe('Shop Flow', () => {
		it('should render ERC721ShopModal for shop flow with ERC721 collection', () => {
			// Initialize store with shop props
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123',
					salesContractAddress: '0x456',
					items: [{ tokenId: 1n } as any],
					quantityDecimals: 0,
					quantityRemaining: 10n,
					salePrice: {
						amount: 1000000000000000000n,
						currencyAddress: '0x0',
					},
					cardType: 'shop',
				},
				analyticsFn: mockAnalyticsFn,
			});

			// Mock useLoadData to return complete data for ERC721 shop flow
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection721,
				collectable: undefined,
				address: undefined,
				order: undefined,
				checkoutOptions: undefined,
				currency: mockCurrency,
				shopData: mockShopData,
				isLoading: false,
				isError: false,
				error: null,
			});

			render(<BuyModalRouter />);

			expect(screen.getByTestId('erc721-shop-modal')).toBeInTheDocument();
			expect(
				screen.getByText('ERC721 Shop Modal - Chain 1'),
			).toBeInTheDocument();
		});

		it('should render ERC1155ShopModal for shop flow with ERC1155 collection', () => {
			// Initialize store with shop props
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123',
					salesContractAddress: '0x456',
					items: [{ tokenId: 1n } as any],
					quantityDecimals: 0,
					quantityRemaining: 10n,
					salePrice: {
						amount: 1000000000000000000n,
						currencyAddress: '0x0',
					},
					cardType: 'shop',
				},
				analyticsFn: mockAnalyticsFn,
			});

			// Mock useLoadData to return complete data for ERC1155 shop flow
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection1155,
				collectable: undefined,
				address: undefined,
				order: undefined,
				checkoutOptions: undefined,
				currency: mockCurrency,
				shopData: mockShopData,
				isLoading: false,
				isError: false,
				error: null,
			});

			render(<BuyModalRouter />);

			expect(screen.getByTestId('erc1155-shop-modal')).toBeInTheDocument();
			expect(
				screen.getByText('ERC1155 Shop Modal - Chain 1'),
			).toBeInTheDocument();
		});

		it('should show loading modal when shop data is incomplete', () => {
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123',
					salesContractAddress: '0x456',
					items: [{ tokenId: 1n } as any],
					quantityDecimals: 0,
					quantityRemaining: 10n,
					salePrice: {
						amount: 1000000000000000000n,
						currencyAddress: '0x0',
					},
					cardType: 'shop',
				},
				analyticsFn: mockAnalyticsFn,
			});

			// Mock incomplete shop data
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection721,
				collectable: undefined,
				address: undefined,
				order: undefined,
				checkoutOptions: undefined,
				currency: undefined, // Missing currency
				shopData: mockShopData,
				isLoading: false,
				isError: false,
				error: null,
			});

			render(<BuyModalRouter />);

			expect(screen.getByText('Loading payment options')).toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('should show error modal when loadData has an error', () => {
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123',
					tokenId: 1n,
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
				},
				analyticsFn: mockAnalyticsFn,
			});

			// Mock error state
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: undefined,
				collectable: undefined,
				address: undefined,
				order: undefined,
				checkoutOptions: undefined,
				currency: undefined,
				shopData: undefined,
				isLoading: false,
				isError: true,
				error: new Error('Test error'),
			});

			render(<BuyModalRouter />);

			expect(screen.getByText('Loading Error')).toBeInTheDocument();
		});

		it('should show loading modal when data is still loading', () => {
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123',
					tokenId: 1n,
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
				},
				analyticsFn: mockAnalyticsFn,
			});

			// Mock loading state
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: undefined,
				collectable: undefined,
				address: undefined,
				order: undefined,
				checkoutOptions: undefined,
				currency: undefined,
				shopData: undefined,
				isLoading: true,
				isError: false,
				error: null,
			});

			render(<BuyModalRouter />);

			expect(screen.getByText('Loading payment options')).toBeInTheDocument();
		});

		it('should show error modal for unsupported configuration', () => {
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123',
					salesContractAddress: '0x456',
					items: [{ tokenId: 1n } as any],
					quantityDecimals: 0,
					quantityRemaining: 10n,
					salePrice: {
						amount: 1000000000000000000n,
						currencyAddress: '0x0',
					},
					cardType: 'shop',
				},
				analyticsFn: mockAnalyticsFn,
			});

			// Mock unsupported collection type
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: {
					...mockCollection721,
					type: 'UNSUPPORTED' as never,
				},
				collectable: undefined,
				address: undefined,
				order: undefined,
				checkoutOptions: undefined,
				currency: mockCurrency,
				shopData: mockShopData,
				isLoading: false,
				isError: false,
				error: null,
			});

			render(<BuyModalRouter />);

			expect(screen.getByText('Unsupported Configuration')).toBeInTheDocument();
		});
	});

	describe('Default Behavior', () => {
		it('should default to market flow when marketplaceType is not specified', () => {
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123',
					tokenId: 1n,
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
					// cardType not specified - should default to MARKET
				},
				analyticsFn: mockAnalyticsFn,
			});

			// Mock useLoadData to return complete data for ERC721 market flow
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection721,
				collectable: mockCollectable,
				address: '0x1234567890123456789012345678901234567890',
				order: mockOrder,
				checkoutOptions: mockCheckoutOptions,
				currency: mockCurrency,
				shopData: undefined,
				isLoading: false,
				isError: false,
				error: null,
			});

			render(<BuyModalRouter />);

			expect(screen.getByTestId('erc721-buy-modal')).toBeInTheDocument();
		});
	});
});
