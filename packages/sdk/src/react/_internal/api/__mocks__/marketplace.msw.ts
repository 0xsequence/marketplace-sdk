import { http, HttpResponse } from 'msw';

import {
	type Currency,
	type TokenMetadata,
	type Order,
	type CollectibleOrder,
	type Activity,
	MarketplaceKind,
	OrderSide,
	OrderStatus,
	ActivityAction,
	type Marketplace,
} from '../marketplace.gen';

import { zeroAddress } from 'viem';

// Mock data
export const mockCurrencies: Currency[] = [
	{
		chainId: 1,
		contractAddress: zeroAddress,
		name: 'Ethereum',
		symbol: 'ETH',
		decimals: 18,
		imageUrl: 'https://example.com/eth.png',
		exchangeRate: 1800.0,
		defaultChainCurrency: false,
		nativeCurrency: true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		chainId: 1,
		contractAddress: '0x1234567890123456789012345678901234567890',
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
		imageUrl: 'https://example.com/usdc.png',
		exchangeRate: 1.0,
		defaultChainCurrency: true,
		nativeCurrency: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

export const mockTokenMetadata: TokenMetadata = {
	tokenId: '1',
	name: 'Mock NFT',
	description: 'A mock NFT for testing',
	image: 'https://example.com/nft.png',
	attributes: [{ trait_type: 'Type', value: 'Mock' }],
};

export const mockOrder: Order = {
	orderId: '0x9876543210987654321098765432109876543210',
	marketplace: MarketplaceKind.sequence_marketplace_v2,
	side: OrderSide.listing,
	status: OrderStatus.active,
	chainId: 1,
	originName: 'Sequence',
	collectionContractAddress: '0x1234567890123456789012345678901234567890',
	tokenId: '1',
	createdBy: '0xabcdef0123456789abcdef0123456789abcdef01',
	priceAmount: '1000000000000000000',
	priceAmountFormatted: '1.0',
	priceAmountNet: '950000000000000000',
	priceAmountNetFormatted: '0.95',
	priceCurrencyAddress: '0x1234567890123456789012345678901234567890',
	priceDecimals: 18,
	priceUSD: 1800.0,
	quantityInitial: '1',
	quantityInitialFormatted: '1',
	quantityRemaining: '1',
	quantityRemainingFormatted: '1',
	quantityAvailable: '1',
	quantityAvailableFormatted: '1',
	quantityDecimals: 0,
	feeBps: 500,
	feeBreakdown: [],
	validFrom: new Date().toISOString(),
	validUntil: new Date(Date.now() + 86400000).toISOString(),
	blockNumber: 1234567,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const mockCollectibleOrder: CollectibleOrder = {
	metadata: mockTokenMetadata,
	order: mockOrder,
};

export const mockActivity: Activity = {
	chainId: 1,
	contractAddress: '0x1234567890123456789012345678901234567890',
	tokenId: '1',
	action: ActivityAction.listing,
	txHash: '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
	from: '0x1234567890123456789012345678901234567890',
	to: '0xabcdef0123456789abcdef0123456789abcdef01',
	quantity: '1',
	quantityDecimals: 0,
	priceAmount: '1000000000000000000',
	priceAmountFormatted: '1.0',
	priceCurrencyAddress: '0x1234567890123456789012345678901234567890',
	priceDecimals: 18,
	activityCreatedAt: new Date().toISOString(),
	uniqueHash: '0x9876543210987654321098765432109876543210',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

// Debug configuration
export let isDebugEnabled = false;
export const enableDebug = () => (isDebugEnabled = true);
export const disableDebug = () => (isDebugEnabled = false);

// Debug logger function
const debugLog = (endpoint: string, request: any, response: any) => {
	if (isDebugEnabled) {
		console.log(`[MSW Debug] ${endpoint}:`, {
			request,
			response,
		});
	}
};

type Endpoint = Capitalize<keyof Marketplace>;
type EndpointReturn<E extends Endpoint> = Awaited<
	ReturnType<Marketplace[Uncapitalize<E>]>
>;

export const mockMarketplaceEndpoint = (endpoint: Endpoint) =>
	`*/rpc/Marketplace/${endpoint}`;

const mockMarketplaceHandler = <E extends Endpoint>(
	endpoint: E,
	response: EndpointReturn<E>,
) => {
	return http.post(mockMarketplaceEndpoint(endpoint), (request) => {
		debugLog(endpoint, request, response);
		return HttpResponse.json(response);
	});
};

// MSW handlers
export const handlers = [
	mockMarketplaceHandler('ListCurrencies', {
		currencies: mockCurrencies,
	}),

	mockMarketplaceHandler('GetCollectible', {
		metadata: mockTokenMetadata,
	}),

	mockMarketplaceHandler('ListCollectibles', {
		collectibles: [mockCollectibleOrder],
		page: { page: 1, pageSize: 10, more: false },
	}),

	mockMarketplaceHandler('GetFloorOrder', {
		collectible: mockCollectibleOrder,
	}),

	mockMarketplaceHandler('ListCollectionActivities', {
		activities: [mockActivity],
		page: { page: 1, pageSize: 10, more: false },
	}),

	mockMarketplaceHandler('ListCollectibleActivities', {
		activities: [mockActivity],
		page: { page: 1, pageSize: 10, more: false },
	}),

	mockMarketplaceHandler('GetOrders', {
		orders: [mockOrder],
		page: { page: 1, pageSize: 10, more: false },
	}),

	mockMarketplaceHandler('GetLowestPriceOfferForCollectible', {
		order: mockOrder,
	}),

	mockMarketplaceHandler('GetHighestPriceOfferForCollectible', {
		order: mockOrder,
	}),

	mockMarketplaceHandler('GetLowestPriceListingForCollectible', {
		order: mockOrder,
	}),

	mockMarketplaceHandler('GetHighestPriceListingForCollectible', {
		order: mockOrder,
	}),

	mockMarketplaceHandler('ListListingsForCollectible', {
		listings: [mockOrder],
		page: { page: 1, pageSize: 10, more: false },
	}),

	mockMarketplaceHandler('ListOffersForCollectible', {
		offers: [mockOrder],
		page: { page: 1, pageSize: 10, more: false },
	}),

	mockMarketplaceHandler('GetCountOfListingsForCollectible', {
		count: 1,
	}),

	mockMarketplaceHandler('GetCountOfOffersForCollectible', {
		count: 1,
	}),
];
