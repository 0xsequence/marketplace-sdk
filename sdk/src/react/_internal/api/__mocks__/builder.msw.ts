import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import {
	FilterCondition,
	type LookupMarketplaceConfigReturn,
	type MarketplaceConfig,
	MarketplaceWallet,
	OrderbookKind,
} from '../../../../types';
import { mockCurrencies } from './marketplace.msw';

export const mockCollections = [
	{
		address: zeroAddress,
		chainId: 1,
		currencyOptions: mockCurrencies.map((c) => c.contractAddress),
		exchanges: [],
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
	},
	{
		address: '0x1234567890123456789012345678901234567890',
		chainId: 137,
		currencyOptions: [mockCurrencies[0].contractAddress],
		exchanges: [],
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
export const mockConfig = {
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

// Debug logger function
const debugLog = (endpoint: string, request: Request, response: Response) => {
	if (isDebugEnabled) {
		console.log(`[MSW Debug] ${endpoint}:`, {
			request,
			response,
		});
	}
};

export const mockLookupMarketplaceConfigError = () => {
	return HttpResponse.json(
		{ code: 3000, msg: 'Project not found' },
		{ status: 404 },
	);
};

export const createLookupMarketplaceConfigHandler = (config = mockConfig) =>
	http.post('*/rpc/Builder/LookupMarketplaceConfig', () => {
		return HttpResponse.json({
			settings: config as MarketplaceConfig,
		} satisfies LookupMarketplaceConfigReturn);
	});

export const createLookupMarketplaceConfigErrorHandler = () =>
	http.post('*/rpc/Builder/LookupMarketplaceConfig', () => {
		return mockLookupMarketplaceConfigError();
	});

export const createStylesHandler = (styles = mockStyles) =>
	http.get('*/marketplace/*/styles.css', ({ request }) => {
		const response = new HttpResponse(styles, {
			headers: { 'Content-Type': 'text/css' },
		});
		debugLog('styles.css', request, response);
		return response;
	});

export const createStylesErrorHandler = () =>
	http.get('*/marketplace/*/styles.css', () => {
		return new HttpResponse('', { status: 500 });
	});

// Default handlers
export const handlers = [
	createLookupMarketplaceConfigHandler(),
	createLookupMarketplaceConfigErrorHandler(),
	createStylesHandler(),
	createStylesErrorHandler(),
];
