import { HttpResponse, http } from 'msw';
import type { Address } from 'viem';
import { zeroAddress } from 'viem';

const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address;

import {
	type Activity,
	ActivityAction,
	type CheckoutOptionsMarketplaceResponse,
	type CollectibleOrder,
	type Collection,
	CollectionPriority,
	CollectionStatus,
	ContractType,
	type Currency,
	CurrencyStatus,
	type MarketplaceClient,
	MarketplaceKind,
	MetadataStatus,
	type Order,
	OrderSide,
	OrderStatus,
	type Step,
	StepType,
	type TokenMetadata,
	TransactionCrypto,
	WalletKind,
} from '../adapters/marketplace/marketplace.gen';

// Mock data
export const mockCurrencies: Currency[] = [
	{
		chainId: 1,
		contractAddress: zeroAddress,
		status: CurrencyStatus.active,
		name: 'Ethereum',
		symbol: 'ETH',
		decimals: 18,
		imageUrl: 'https://example.com/eth.png',
		exchangeRate: 1800.0,
		defaultChainCurrency: false,
		nativeCurrency: true,
		openseaListing: true,
		openseaOffer: true,
		createdAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
		updatedAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
	},
	{
		chainId: 1,
		contractAddress: USDC_ADDRESS,
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
		imageUrl: 'https://example.com/usdc.png',
		exchangeRate: 1.0,
		defaultChainCurrency: true,
		nativeCurrency: false,
		openseaListing: true,
		openseaOffer: true,
		status: CurrencyStatus.active,
		createdAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
		updatedAt: new Date('2025-03-16T13:04:16.098Z').toISOString(),
	},
];

export const mockTokenMetadata: TokenMetadata = {
	tokenId: 1n,
	name: 'Mock NFT',
	description: 'A mock NFT for testing',
	image: 'https://example.com/nft.png',
	attributes: [{ trait_type: 'Type', value: 'Mock' }],
	status: MetadataStatus.AVAILABLE,
};

export const mockOrder: Order = {
	orderId: '0x9876543210987654321098765432109876543210',
	marketplace: MarketplaceKind.sequence_marketplace_v2,
	side: OrderSide.listing,
	status: OrderStatus.active,
	chainId: 1,
	originName: 'Sequence',
	collectionContractAddress:
		'0x1234567890123456789012345678901234567890' as Address,
	// tokenId: '1', // TokenID is optional, so no part of the code should fail if it's not provided
	createdBy: '0xabcdef0123456789abcdef0123456789abcdef01' as Address,
	priceAmount: 1000000000000000000n,
	priceAmountFormatted: '1.0',
	priceAmountNet: 950000000000000000n,
	priceAmountNetFormatted: '0.95',
	priceCurrencyAddress: '0x1234567890123456789012345678901234567890' as Address,
	priceDecimals: 18,
	priceUSD: 1800.0,
	priceUSDFormatted: '1800.0',
	quantityInitial: 1n,
	quantityInitialFormatted: '1',
	quantityRemaining: 1n,
	quantityRemainingFormatted: '1',
	quantityAvailable: 1n,
	quantityAvailableFormatted: '1',
	quantityDecimals: 0,
	feeBps: 500,
	feeBreakdown: [],
	validFrom: new Date().toISOString(),
	validUntil: new Date(Date.now() + 86400000).toISOString(),
	blockNumber: 1234567,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	slug: 'test-order',
};

export const mockCollectibleOrder: CollectibleOrder = {
	metadata: mockTokenMetadata,
	order: mockOrder,
};

export const mockActivity: Activity = {
	chainId: 1,
	contractAddress: '0x1234567890123456789012345678901234567890' as Address,
	tokenId: 1n,
	action: ActivityAction.listing,
	txHash: '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
	from: '0x1234567890123456789012345678901234567890' as Address,
	to: '0xabcdef0123456789abcdef0123456789abcdef01' as Address,
	quantity: 1n,
	quantityDecimals: 0,
	priceAmount: 1000000000000000000n,
	priceAmountFormatted: '1.0',
	priceCurrencyAddress: '0x1234567890123456789012345678901234567890' as Address,
	priceDecimals: 18,
	activityCreatedAt: new Date().toISOString(),
	uniqueHash: '0x9876543210987654321098765432109876543210',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const mockCollection: Collection = {
	status: CollectionStatus.active,
	chainId: 1,
	contractAddress: '0x1234567890123456789012345678901234567890' as Address,
	contractType: ContractType.ERC721,
	priority: CollectionPriority.normal,
	tokenQuantityDecimals: 0,
	config: {
		lastSynced: {},
		collectiblesSynced: new Date().toISOString(),
		activitiesSynced: new Date().toISOString(),
		activitiesSyncedContinuity: new Date().toISOString(),
	},
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

// Create a function that returns a Step object
export const createMockStep = (step: StepType): Step => ({
	id: step,
	data: '0x...',
	to: '0x1234567890123456789012345678901234567890',
	value: 0n,
	price: 0n,
});

export const createMockSteps = (steps: StepType[]): Step[] =>
	steps.map(createMockStep);

export const mockCheckoutOptions: CheckoutOptionsMarketplaceResponse = {
	options: {
		crypto: TransactionCrypto.all,
		swap: [],
		nftCheckout: [],
		onRamp: [],
	},
};

export const mockCountListingsForCollectible = 1;

// Debug configuration
export let isDebugEnabled = false;
export const enableDebug = () => {
	isDebugEnabled = true;
};
export const disableDebug = () => {
	isDebugEnabled = false;
};

// Debug logger function
// biome-ignore lint/suspicious/noExplicitAny: debug function needs to accept any type of request/response data
const debugLog = (endpoint: string, request: any, response: any) => {
	if (isDebugEnabled) {
		console.log(`[MSW Debug] ${endpoint}:`, {
			request,
			response,
		});
	}
};

type Endpoint = Capitalize<keyof MarketplaceClient>;
type EndpointReturn<E extends Endpoint> =
	// biome-ignore lint/suspicious/noExplicitAny: Generic type helper for extracting return types
	MarketplaceClient[Uncapitalize<E>] extends (...args: any[]) => any
		? Awaited<ReturnType<MarketplaceClient[Uncapitalize<E>]>>
		: never;

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

// BigInt version of mockOrder for use in tests that expect BigInt values
export const mockOrderBigInt = {
	...mockOrder,
	priceAmount: BigInt(mockOrder.priceAmount),
	priceAmountNet: BigInt(mockOrder.priceAmountNet),
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

	mockMarketplaceHandler('GetCollectionDetail', {
		collection: mockCollection,
	}),

	mockMarketplaceHandler('GetCollectionActiveListingsCurrencies', {
		currencies: mockCurrencies,
	}),

	mockMarketplaceHandler('GetCollectionActiveOffersCurrencies', {
		currencies: mockCurrencies,
	}),

	mockMarketplaceHandler('GetCollectibleLowestOffer', {
		order: mockOrder,
	}),

	mockMarketplaceHandler('GetCollectibleHighestOffer', {
		order: mockOrder,
	}),

	mockMarketplaceHandler('GetCollectibleLowestListing', {
		order: mockOrder,
	}),

	mockMarketplaceHandler('GetCollectibleHighestListing', {
		order: mockOrder,
	}),

	mockMarketplaceHandler('ListCollectibleListings', {
		listings: [mockOrder],
		page: { page: 1, pageSize: 10, more: false },
	}),

	mockMarketplaceHandler('ListCollectibleOffers', {
		offers: [mockOrder],
		page: { page: 1, pageSize: 10, more: false },
	}),

	// by default, all endpoints include a tokenApproval step
	mockMarketplaceHandler('GenerateBuyTransaction', {
		steps: createMockSteps([StepType.buy]),
	}),

	mockMarketplaceHandler('GenerateSellTransaction', {
		steps: createMockSteps([StepType.tokenApproval, StepType.sell]),
	}),

	mockMarketplaceHandler('GenerateListingTransaction', {
		steps: createMockSteps([StepType.tokenApproval, StepType.createListing]),
	}),

	http.post(
		mockMarketplaceEndpoint('GenerateOfferTransaction'),
		async ({ request }) => {
			const body = (await request.json()) as { walletType?: WalletKind };

			const isSequenceWallet = body?.walletType === WalletKind.sequence;

			const steps = isSequenceWallet
				? createMockSteps([StepType.createOffer]) // Sequence wallet - no approval needed
				: createMockSteps([StepType.tokenApproval, StepType.createOffer]); // Other wallets - approval needed

			debugLog('GenerateOfferTransaction', body, { steps });

			return HttpResponse.json({
				steps,
			});
		},
	),

	mockMarketplaceHandler('GenerateCancelTransaction', {
		steps: createMockSteps([StepType.cancel]),
	}),

	mockMarketplaceHandler('Execute', {
		orderId: '0x9876543210987654321098765432109876543210',
	}),

	mockMarketplaceHandler('GetCountOfAllCollectibles', {
		count: 100,
	}),

	mockMarketplaceHandler('GetCountOfFilteredCollectibles', {
		count: 50,
	}),

	mockMarketplaceHandler('ListCollectiblesWithLowestListing', {
		collectibles: [mockCollectibleOrder],
		page: { page: 1, pageSize: 10, more: false },
	}),

	mockMarketplaceHandler('ListCollectiblesWithHighestOffer', {
		collectibles: [mockCollectibleOrder],
		page: { page: 1, pageSize: 10, more: false },
	}),

	mockMarketplaceHandler('SyncOrder', {}),

	mockMarketplaceHandler('SyncOrders', {}),

	mockMarketplaceHandler('CheckoutOptionsSalesContract', {
		options: {
			crypto: TransactionCrypto.all,
			swap: [],
			nftCheckout: [],
			onRamp: [],
		},
	}),

	mockMarketplaceHandler('CheckoutOptionsMarketplace', mockCheckoutOptions),
];

export const marketplaceConfigHandlers = handlers;
