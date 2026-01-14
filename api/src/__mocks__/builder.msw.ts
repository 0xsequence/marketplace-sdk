import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import {
	FilterCondition,
	type LookupMarketplaceReturn,
	MarketplaceWalletType,
} from '../adapters/builder/builder.gen';
import { OrderbookKind } from '../adapters/marketplace/marketplace.gen';
import { mockCurrencies } from './marketplace.msw';

export const mockMarketCollections = [
	{
		id: 1,
		projectId: 1,
		contractType: 'ERC721',
		itemsAddress: zeroAddress,
		chainId: 1,
		currencyOptions: mockCurrencies.map((c) => c.contractAddress),
		bannerUrl: '',
		feePercentage: 3.5,
		destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
		filterSettings: {
			filterOrder: ['Type', 'Rarity'],
			exclusions: [
				{
					key: 'Type',
					condition: FilterCondition.SPECIFIC_VALUE,
					value: 'Sample',
				},
			],
		},
		createdAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
		updatedAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
	},
	{
		id: 2,
		projectId: 1,
		contractType: 'ERC1155',
		itemsAddress: '0x1234567890123456789012345678901234567890',
		chainId: 137,
		currencyOptions: [mockCurrencies[0].contractAddress],
		bannerUrl: 'https://example.com/collection-banner.png',
		feePercentage: 2.5,
		destinationMarketplace: OrderbookKind.opensea,
		filterSettings: {
			filterOrder: ['Category', 'Level', 'Element'],
			exclusions: [
				{
					key: 'Category',
					condition: FilterCondition.ENTIRE_KEY,
				},
				{
					key: 'Level',
					condition: FilterCondition.SPECIFIC_VALUE,
					value: 'Legendary',
				},
			],
		},
		createdAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
		updatedAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
	},
];

export const mockShopCollections = [
	{
		id: 1,
		projectId: 1,
		chainId: 1,
		itemsAddress: zeroAddress,
		saleAddress: zeroAddress,
		name: 'Mock Shop Collection',
		bannerUrl: 'https://example.com/shop-banner.png',
		saleBannerUrl: 'https://example.com/shop-sale-banner.png',
		tokenIds: ['1', '2', '3'],
		customTokenIds: [],
		private: false,
		createdAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
		updatedAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
	},
	{
		id: 2,
		projectId: 1,
		chainId: 137,
		itemsAddress: '0x1234567890123456789012345678901234567890',
		saleAddress: '0x1234567890123456789012345678901234567890',
		name: 'Polygon Shop Collection',
		bannerUrl: 'https://example.com/polygon-shop-banner.png',
		saleBannerUrl: 'https://example.com/polygon-shop-sale-banner.png',
		tokenIds: ['4', '5', '6'],
		customTokenIds: [],
		private: false,
		createdAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
		updatedAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
	},
];

export const mockConfig = {
	marketplace: {
		projectId: 1,
		settings: {
			style: {},
			publisherId: 'publisher-1',
			title: 'Mock Marketplace',
			socials: {
				twitter: 'https://twitter.com/mock',
				discord: 'https://discord.gg/mock',
				website: 'https://mock.com',
				tiktok: 'https://tiktok.com/@mock',
				instagram: 'https://instagram.com/mock',
				youtube: 'https://youtube.com/mock',
			},
			faviconUrl: 'https://example.com/favicon.ico',
			walletOptions: {
				walletType: MarketplaceWalletType.UNIVERSAL,
				oidcIssuers: {},
				connectors: [],
				includeEIP6963Wallets: true,
			},
			logoUrl: 'https://example.com/logo.png',
			fontUrl: 'https://example.com/font.woff2',
			accessKey: 'mock-access-key',
			isTrailsEnabled: true,
		},
		market: {
			enabled: true,
			bannerUrl: 'https://example.com/market-banner.png',
			ogImage: 'https://example.com/og-image.png',
			private: false,
		},
		shop: {
			enabled: true,
			bannerUrl: 'https://example.com/shop-banner.png',
			ogImage: 'https://example.com/shop-og-image.png',
			private: false,
		},
		createdAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
		updatedAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
	},
	marketCollections: [
		{
			id: 1,
			projectId: 1,
			chainId: 1,
			itemsAddress: zeroAddress,
			contractType: 'ERC721',
			bannerUrl: 'https://example.com/market-banner.png',
			feePercentage: 3.5,
			currencyOptions: mockCurrencies.map((c) => c.contractAddress),
			destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
			filterSettings: {
				filterOrder: ['Type', 'Rarity'],
				exclusions: [
					{
						key: 'Type',
						condition: FilterCondition.SPECIFIC_VALUE,
						value: 'Sample',
					},
				],
			},
			private: false,
			createdAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
			updatedAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
		},
		{
			id: 2,
			projectId: 1,
			chainId: 137,
			itemsAddress: '0x1234567890123456789012345678901234567890',
			contractType: 'ERC1155',
			bannerUrl: 'https://example.com/collection-banner.png',
			feePercentage: 2.5,
			currencyOptions: [mockCurrencies[0].contractAddress],
			destinationMarketplace: OrderbookKind.opensea,
			filterSettings: {
				filterOrder: ['Category', 'Level', 'Element'],
				exclusions: [
					{
						key: 'Category',
						condition: FilterCondition.ENTIRE_KEY,
					},
					{
						key: 'Level',
						condition: FilterCondition.SPECIFIC_VALUE,
						value: 'Legendary',
					},
				],
			},
			private: false,
			createdAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
			updatedAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
		},
	],
	shopCollections: mockShopCollections,
} satisfies LookupMarketplaceReturn;

// Debug configuration
export let isDebugEnabled = false;
export const enableDebug = () => {
	isDebugEnabled = true;
};
export const disableDebug = () => {
	isDebugEnabled = false;
};

// // Debug logger function
// const debugLog = (endpoint: string, request: Request, response: Response) => {
//   if (isDebugEnabled) {
//     console.log(`[MSW Debug] ${endpoint}:`, {
//       request,
//       response,
//     });
//   }
// };

export const mockLookupMarketplaceError = () => {
	return HttpResponse.json(
		{ code: 3000, msg: 'Project not found' },
		{ status: 404 },
	);
};

export const createLookupMarketplaceHandler = (
	config: LookupMarketplaceReturn = mockConfig,
) =>
	http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
		return HttpResponse.json({
			...config,
		} satisfies LookupMarketplaceReturn);
	});

export const createLookupMarketplaceErrorHandler = () =>
	http.post('*/rpc/MarketplaceService/LookupMarketplace', () => {
		return mockLookupMarketplaceError();
	});

// Default handlers
export const handlers = [
	createLookupMarketplaceHandler(),
	createLookupMarketplaceErrorHandler(),
];
