import { render, screen } from '@test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MarketplaceType } from '../../../../../types';
import { MarketplaceKind } from '../../../../_internal';
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
	address: '0x123',
	chainId: 1,
	symbol: 'TEST',
	source: 'https://example.com',
	status: 'AVAILABLE' as const,
	deployed: true,
	updatedAt: new Date().toISOString(),
	bytecodeHash: '0x1234567890',
	extensions: {
		description: 'Test Collection',
		link: 'https://example.com',
		ogImage: 'https://example.com/image.png',
		ogName: 'Test Collection',
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

const mockCollection1155 = {
	type: 'ERC1155' as const,
	name: 'Test Collection',
	address: '0x123',
	chainId: 1,
	symbol: 'TEST',
	source: 'https://example.com',
	status: 'AVAILABLE' as const,
	deployed: true,
	updatedAt: new Date().toISOString(),
	bytecodeHash: '0x1234567890',
	extensions: {
		description: 'Test Collection',
		link: 'https://example.com',
		ogImage: 'https://example.com/image.png',
		ogName: 'Test Collection',
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

const mockCollectable = {
	id: '1',
	name: 'Test Collectible',
};

const mockOrder = {
	orderId: '1',
	marketplace: MarketplaceKind.sequence_marketplace_v2,
};

const mockWallet = {
	address: '0xabc',
};

const mockCheckoutOptions = {
	options: [],
};

const mockCurrency = {
	name: 'ETH',
	symbol: 'ETH',
	decimals: 18,
};

const mockShopData = {
	salePrice: {
		amount: '1000000000000000000',
		currencyAddress: '0x0' as `0x${string}`,
	},
	quantityDecimals: 0,
	quantityRemaining: '10',
};

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
					collectionAddress: '0x123' as `0x${string}`,
					collectibleId: '1',
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
					marketplaceType: MarketplaceType.MARKET,
				},
			});

			// Mock useLoadData to return complete data for ERC721 market flow
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection721,
				collectable: mockCollectable,
				wallet: mockWallet,
				order: mockOrder,
				checkoutOptions: mockCheckoutOptions,
				currency: mockCurrency,
				shopData: null,
				isLoading: false,
				isError: false,
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
					collectionAddress: '0x123' as `0x${string}`,
					collectibleId: '1',
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
					marketplaceType: MarketplaceType.MARKET,
				},
			});

			// Mock useLoadData to return complete data for ERC1155 market flow
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection1155,
				collectable: mockCollectable,
				wallet: mockWallet,
				order: mockOrder,
				checkoutOptions: mockCheckoutOptions,
				currency: mockCurrency,
				shopData: null,
				isLoading: false,
				isError: false,
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
					collectionAddress: '0x123' as `0x${string}`,
					collectibleId: '1',
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
				},
			});

			// Mock incomplete data
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection721,
				collectable: null, // Missing collectable
				wallet: mockWallet,
				order: mockOrder,
				checkoutOptions: mockCheckoutOptions,
				currency: mockCurrency,
				shopData: null,
				isLoading: false,
				isError: false,
			});

			render(<BuyModalRouter />);

			expect(screen.getByText('Loading Sequence Pay')).toBeInTheDocument();
		});
	});

	describe('Shop Flow', () => {
		it('should render ERC721ShopModal for shop flow with ERC721 collection', () => {
			// Initialize store with shop props
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123' as `0x${string}`,
					salesContractAddress: '0x456' as `0x${string}`,
					items: [{ tokenId: '1' }],
					quantityDecimals: 0,
					quantityRemaining: 10,
					salePrice: {
						amount: '1000000000000000000',
						currencyAddress: '0x0' as `0x${string}`,
					},
					marketplaceType: MarketplaceType.SHOP,
				},
			});

			// Mock useLoadData to return complete data for ERC721 shop flow
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection721,
				collectable: null,
				wallet: null,
				order: null,
				checkoutOptions: null,
				currency: mockCurrency,
				shopData: mockShopData,
				isLoading: false,
				isError: false,
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
					collectionAddress: '0x123' as `0x${string}`,
					salesContractAddress: '0x456' as `0x${string}`,
					items: [{ tokenId: '1' }],
					quantityDecimals: 0,
					quantityRemaining: 10,
					salePrice: {
						amount: '1000000000000000000',
						currencyAddress: '0x0' as `0x${string}`,
					},
					marketplaceType: MarketplaceType.SHOP,
				},
			});

			// Mock useLoadData to return complete data for ERC1155 shop flow
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection1155,
				collectable: null,
				wallet: null,
				order: null,
				checkoutOptions: null,
				currency: mockCurrency,
				shopData: mockShopData,
				isLoading: false,
				isError: false,
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
					collectionAddress: '0x123' as `0x${string}`,
					salesContractAddress: '0x456' as `0x${string}`,
					items: [{ tokenId: '1' }],
					quantityDecimals: 0,
					quantityRemaining: 10,
					salePrice: {
						amount: '1000000000000000000',
						currencyAddress: '0x0' as `0x${string}`,
					},
					marketplaceType: MarketplaceType.SHOP,
				},
			});

			// Mock incomplete shop data
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection721,
				collectable: null,
				wallet: null,
				order: null,
				checkoutOptions: null,
				currency: null, // Missing currency
				shopData: mockShopData,
				isLoading: false,
				isError: false,
			});

			render(<BuyModalRouter />);

			expect(screen.getByText('Loading Sequence Pay')).toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('should show error modal when loadData has an error', () => {
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123' as `0x${string}`,
					collectibleId: '1',
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
				},
			});

			// Mock error state
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: null,
				collectable: null,
				wallet: null,
				order: null,
				checkoutOptions: null,
				currency: null,
				shopData: null,
				isLoading: false,
				isError: true,
			});

			render(<BuyModalRouter />);

			expect(screen.getByText('Loading Error')).toBeInTheDocument();
		});

		it('should show loading modal when data is still loading', () => {
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123' as `0x${string}`,
					collectibleId: '1',
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
				},
			});

			// Mock loading state
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: null,
				collectable: null,
				wallet: null,
				order: null,
				checkoutOptions: null,
				currency: null,
				shopData: null,
				isLoading: true,
				isError: false,
			});

			render(<BuyModalRouter />);

			expect(screen.getByText('Loading Sequence Pay')).toBeInTheDocument();
		});

		it('should return null when loadDataResult is undefined', () => {
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123' as `0x${string}`,
					collectibleId: '1',
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
				},
			});

			// Mock undefined result
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue(
				undefined as never,
			);

			const { container } = render(<BuyModalRouter />);

			expect(container.firstChild).toBeNull();
		});

		it('should show error modal for unsupported configuration', () => {
			buyModalStore.send({
				type: 'open',
				props: {
					chainId: 1,
					collectionAddress: '0x123' as `0x${string}`,
					salesContractAddress: '0x456' as `0x${string}`,
					items: [{ tokenId: '1' }],
					quantityDecimals: 0,
					quantityRemaining: 10,
					salePrice: {
						amount: '1000000000000000000',
						currencyAddress: '0x0' as `0x${string}`,
					},
					marketplaceType: MarketplaceType.SHOP,
				},
			});

			// Mock unsupported collection type
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: {
					...mockCollection721,
					type: 'UNSUPPORTED' as never,
				},
				collectable: null,
				wallet: null,
				order: null,
				checkoutOptions: null,
				currency: mockCurrency,
				shopData: mockShopData,
				isLoading: false,
				isError: false,
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
					collectionAddress: '0x123' as `0x${string}`,
					collectibleId: '1',
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					orderId: '1',
					// marketplaceType not specified - should default to MARKET
				},
			});

			// Mock useLoadData to return complete data for ERC721 market flow
			vi.spyOn(useLoadDataModule, 'useLoadData').mockReturnValue({
				collection: mockCollection721,
				collectable: mockCollectable,
				wallet: mockWallet,
				order: mockOrder,
				checkoutOptions: mockCheckoutOptions,
				currency: mockCurrency,
				shopData: null,
				isLoading: false,
				isError: false,
			});

			render(<BuyModalRouter />);

			expect(screen.getByTestId('erc721-buy-modal')).toBeInTheDocument();
		});
	});
});
