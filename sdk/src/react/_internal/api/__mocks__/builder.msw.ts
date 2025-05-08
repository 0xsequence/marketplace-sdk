import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import {
	FilterCondition,
	type LookupMarketplaceConfigReturn,
	type MarketplaceConfig,
	MarketplaceType,
	MarketplaceWallet,
	OrderbookKind,
} from '../../../../types';
import { mockCurrencies } from './marketplace.msw';

export const mockMarketCollections = [
	{
		id: 1,
		projectId: 1,
		contractType: 'ERC721',
		itemsAddress: zeroAddress,
		chainId: 1,
		marketplaceType: MarketplaceType.ORDERBOOK,
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
		marketplaceType: MarketplaceType.ORDERBOOK,
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
	},
];

// Mock data
export const mockConfig: MarketplaceConfig = {
	projectId: 1,
	publisherId: 'test-publisher',
	title: 'Test Marketplace',
	shortDescription: 'A test marketplace',
	socials: {
		twitter: 'https://twitter.com/test',
		discord: 'https://discord.com/test',
		instagram: 'https://instagram.com/test',
		website: '',
		tiktok: '',
		youtube: '',
	},
	faviconUrl: 'https://example.com/favicon.png',
	landingBannerUrl: 'https://example.com/banner.png',
	logoUrl: 'https://example.com/logo.png',
	walletOptions: {
		walletType: MarketplaceWallet.UNIVERSAL,
		oidcIssuers: {},
		connectors: ['coinbase', 'walletconnect'],
		includeEIP6963Wallets: true,
	},
	collections: mockCollections,
	landingPageLayout: 'default',
	cssString: '',
	manifestUrl: '',
	bannerUrl: '',
};

export const mockStyles = `
  .marketplace-theme {
    --primary-color: #000000;
  }
`;

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
			settings: config,
		} satisfies LookupMarketplaceConfigReturn);
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
