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
	type ListCurrenciesReturn,
	type GetCollectibleReturn,
	type GetFloorOrderReturn,
	type ListCollectiblesReturn,
	type ListCollectionActivitiesReturn,
	type GetCollectibleHighestListingReturn,
	type GetCollectibleHighestOfferReturn,
	type GetCollectibleLowestListingReturn,
	type GetCollectibleLowestOfferReturn,
	type GetCountOfAllCollectiblesReturn,
	type GetCountOfFilteredCollectiblesReturn,
	type GetCountOfListingsForCollectibleReturn,
	type GetCountOfOffersForCollectibleReturn,
	type GetHighestPriceListingForCollectibleReturn,
	type GetHighestPriceOfferForCollectibleReturn,
	type GetLowestPriceListingForCollectibleReturn,
	type GetLowestPriceOfferForCollectibleReturn,
	type GetOrdersReturn,
	type ListCollectibleActivitiesReturn,
	type ListCollectibleListingsReturn,
	type ListCollectibleOffersReturn,
	type ListCollectiblesWithHighestOfferReturn,
	type ListCollectiblesWithLowestListingReturn,
	type ListListingsForCollectibleReturn,
	type ListOffersForCollectibleReturn,
    Marketplace,
} from '../marketplace.gen';



type Endpoints =  Capitalize<keyof Marketplace>;

export const mockMarketplaceEndpoint = (endpoint: Endpoints) => `*/rpc/Marketplace/${endpoint}`;

// Mock data
export const mockCurrency: Currency = {
	chainId: 1,
	contractAddress: '0x1234567890123456789012345678901234567890',
	name: 'Ethereum',
	symbol: 'ETH',
	decimals: 18,
	imageUrl: 'https://example.com/eth.png',
	exchangeRate: 1800.0,
	defaultChainCurrency: true,
	nativeCurrency: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

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

// MSW handlers
export const handlers = [
	// List currencies
	http.post(mockMarketplaceEndpoint("ListCurrencies"), () => {
		return HttpResponse.json({
			currencies: [mockCurrency],
		} satisfies ListCurrenciesReturn);
	}),

	// Get collectible
	http.post(mockMarketplaceEndpoint("GetCollectible"), () => {
		return HttpResponse.json({
			metadata: mockTokenMetadata,
		} satisfies GetCollectibleReturn);
	}),

	// List collectibles
	http.post(mockMarketplaceEndpoint("ListCollectibles"), () => {
		return HttpResponse.json({
			collectibles: [mockCollectibleOrder],
			page: { page: 1, pageSize: 10, more: false },
		} satisfies ListCollectiblesReturn);
	}),

	// Get floor order
	http.post(mockMarketplaceEndpoint("GetFloorOrder"), () => {
		return HttpResponse.json({
			collectible: mockCollectibleOrder,
		} satisfies GetFloorOrderReturn);
	}),

	// List collection activities
	http.post(mockMarketplaceEndpoint("ListCollectionActivities"), () => {
		return HttpResponse.json({
			activities: [mockActivity],
			page: { page: 1, pageSize: 10, more: false },
		} satisfies ListCollectionActivitiesReturn);
	}),

	// List collectible activities
	http.post(mockMarketplaceEndpoint("ListCollectibleActivities"), () => {
		return HttpResponse.json({
			activities: [mockActivity],
			page: { page: 1, pageSize: 10, more: false },
		} satisfies ListCollectibleActivitiesReturn);
	}),

	// Get orders
	http.post(mockMarketplaceEndpoint("GetOrders"), () => {
		return HttpResponse.json({
			orders: [mockOrder],
			page: { page: 1, pageSize: 10, more: false },
		} satisfies GetOrdersReturn);
	}),

	// Get lowest price offer for collectible
	http.post(mockMarketplaceEndpoint("GetLowestPriceOfferForCollectible"), () => {
		return HttpResponse.json({
			order: mockOrder,
		} satisfies GetLowestPriceOfferForCollectibleReturn);
	}),

	// Get highest price offer for collectible
	http.post(mockMarketplaceEndpoint("GetHighestPriceOfferForCollectible"), () => {
		return HttpResponse.json({
			order: mockOrder,
		} satisfies GetHighestPriceOfferForCollectibleReturn);
	}),

	// Get lowest price listing for collectible
	http.post(mockMarketplaceEndpoint("GetLowestPriceListingForCollectible"), () => {
		return HttpResponse.json({
			order: mockOrder,
		} satisfies GetLowestPriceListingForCollectibleReturn);
	}),

	// Get highest price listing for collectible
	http.post(mockMarketplaceEndpoint("GetHighestPriceListingForCollectible"), () => {
		return HttpResponse.json({
			order: mockOrder,
		} satisfies GetHighestPriceListingForCollectibleReturn);
	}),

	// List listings for collectible
	http.post(mockMarketplaceEndpoint("ListListingsForCollectible"), () => {
		return HttpResponse.json({
			listings: [mockOrder],
			page: { page: 1, pageSize: 10, more: false },
		} satisfies ListListingsForCollectibleReturn);
	}),

	// List offers for collectible
	http.post(mockMarketplaceEndpoint("ListOffersForCollectible"), () => {
		return HttpResponse.json({
			offers: [mockOrder],
			page: { page: 1, pageSize: 10, more: false },
		} satisfies ListOffersForCollectibleReturn);
	}),

	// Get count of listings for collectible
	http.post(mockMarketplaceEndpoint("GetCountOfListingsForCollectible"), () => {
		return HttpResponse.json({
			count: 1,
		} satisfies GetCountOfListingsForCollectibleReturn);
	}),

	// Get count of offers for collectible
	http.post(mockMarketplaceEndpoint("GetCountOfOffersForCollectible"), () => {
		return HttpResponse.json({
			count: 1,
		} satisfies GetCountOfOffersForCollectibleReturn);
	}),

	// Get collectible lowest/highest offer/listing
	http.post(mockMarketplaceEndpoint("GetCollectibleLowestOffer"), () => {
		return HttpResponse.json({
			order: mockOrder,
		} satisfies GetCollectibleLowestOfferReturn);
	}),
	http.post(mockMarketplaceEndpoint("GetCollectibleHighestOffer"), () => {
		return HttpResponse.json({
			order: mockOrder,
		} satisfies GetCollectibleHighestOfferReturn);
	}),
	http.post(mockMarketplaceEndpoint("GetCollectibleLowestListing"), () => {
		return HttpResponse.json({
			order: mockOrder,
		} satisfies GetCollectibleLowestListingReturn);
	}),
	http.post(mockMarketplaceEndpoint("GetCollectibleHighestListing"), () => {
		return HttpResponse.json({
			order: mockOrder,
		} satisfies GetCollectibleHighestListingReturn);
	}),

	// List collectible listings/offers
	http.post(mockMarketplaceEndpoint("ListCollectibleListings"), () => {
		return HttpResponse.json({
			listings: [mockOrder],
			page: { page: 1, pageSize: 10, more: false },
		} satisfies ListCollectibleListingsReturn);
	}),
	http.post(mockMarketplaceEndpoint("ListCollectibleOffers"), () => {
		return HttpResponse.json({
			offers: [mockOrder],
			page: { page: 1, pageSize: 10, more: false },
		} satisfies ListCollectibleOffersReturn);
	}),

	// Get count of all/filtered collectibles
	http.post(mockMarketplaceEndpoint("GetCountOfAllCollectibles"), () => {
		return HttpResponse.json({
			count: 1,
		} satisfies GetCountOfAllCollectiblesReturn);
	}),
	http.post(mockMarketplaceEndpoint("GetCountOfFilteredCollectibles"), () => {
		return HttpResponse.json({
			count: 1,
		} satisfies GetCountOfFilteredCollectiblesReturn);
	}),

	// List collectibles with lowest listing/highest offer
	http.post(mockMarketplaceEndpoint("ListCollectiblesWithLowestListing"), () => {
		return HttpResponse.json({
			collectibles: [mockCollectibleOrder],
			page: { page: 1, pageSize: 10, more: false },
		} satisfies ListCollectiblesWithLowestListingReturn);
	}),
	http.post(mockMarketplaceEndpoint("ListCollectiblesWithHighestOffer"), () => {
		return HttpResponse.json({
			collectibles: [mockCollectibleOrder],
			page: { page: 1, pageSize: 10, more: false },
		} satisfies ListCollectiblesWithHighestOfferReturn);
	}),
];
