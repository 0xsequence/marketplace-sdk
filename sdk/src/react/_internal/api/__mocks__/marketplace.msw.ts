import { http, HttpResponse } from 'msw';

import {
	type Activity,
	ActivityAction,
	type CheckoutOptionsMarketplaceReturn,
	type CollectibleOrder,
	type CollectiblePrimarySaleItem,
	type Collection,
	CollectionPriority,
	CollectionStatus,
	ContractType,
	type Currency,
	CurrencyStatus,
	type Marketplace,
	MarketplaceKind,
	type Order,
	OrderSide,
	OrderStatus,
	type PrimarySaleItem,
	PrimarySaleItemDetailType,
	type Step,
	StepType,
	type TokenMetadata,
	TransactionCrypto,
	WalletKind,
} from '../marketplace.gen';

import { USDC_ADDRESS } from '@test/const';
import { zeroAddress } from 'viem';

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
		createdAt: '2025-03-16T13:04:16.098Z',
		updatedAt: '2025-03-16T13:04:16.098Z',
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
		status: CurrencyStatus.active,
		createdAt: '2025-03-16T13:04:16.098Z',
		updatedAt: '2025-03-16T13:04:16.098Z',
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
	// tokenId: '1', // TokenID is optional, so no part of the code should fail if it's not provided
	createdBy: '0xabcdef0123456789abcdef0123456789abcdef01',
	priceAmount: '1000000000000000000',
	priceAmountFormatted: '1.0',
	priceAmountNet: '950000000000000000',
	priceAmountNetFormatted: '0.95',
	priceCurrencyAddress: '0x1234567890123456789012345678901234567890',
	priceDecimals: 18,
	priceUSD: 1800.0,
	priceUSDFormatted: '1800.0',
	quantityInitial: '1',
	quantityInitialFormatted: '1',
	quantityRemaining: '1',
	quantityRemainingFormatted: '1',
	quantityAvailable: '1',
	quantityAvailableFormatted: '1',
	quantityDecimals: 0,
	feeBps: 500,
	feeBreakdown: [],
	validFrom: '2025-01-01T00:00:00.000Z',
	validUntil: '2025-01-02T00:00:00.000Z',
	blockNumber: 1234567,
	createdAt: '2025-01-01T00:00:00.000Z',
	updatedAt: '2025-01-01T00:00:00.000Z',
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
	activityCreatedAt: '2025-01-01T00:00:00.000Z',
	uniqueHash: '0x9876543210987654321098765432109876543210',
	createdAt: '2025-01-01T00:00:00.000Z',
	updatedAt: '2025-01-01T00:00:00.000Z',
};

export const mockCollection: Collection = {
	status: CollectionStatus.active,
	chainId: 1,
	contractAddress: '0x1234567890123456789012345678901234567890',
	contractType: ContractType.ERC721,
	priority: CollectionPriority.normal,
	tokenQuantityDecimals: 0,
	config: {
		lastSynced: {},
		collectiblesSynced: '2025-01-01T00:00:00.000Z',
		activitiesSynced: '2025-01-01T00:00:00.000Z',
		activitiesSyncedContinuity: '2025-01-01T00:00:00.000Z',
	},
	createdAt: '2025-01-01T00:00:00.000Z',
	updatedAt: '2025-01-01T00:00:00.000Z',
};

// Create a function that returns a Step object
export const createMockStep = (step: StepType): Step => ({
	id: step,
	data: '0x...',
	to: '0x1234567890123456789012345678901234567890',
	value: '0',
	price: '0',
});

export const createMockSteps = (steps: StepType[]): Step[] =>
	steps.map(createMockStep);

export const mockCheckoutOptions: CheckoutOptionsMarketplaceReturn = {
	options: {
		crypto: TransactionCrypto.all,
		swap: [],
		nftCheckout: [],
		onRamp: [],
	},
};

export const mockCountListingsForCollectible = 1;

export const mockPrimarySaleItem: PrimarySaleItem = {
	itemAddress: '0x1234567890123456789012345678901234567890',
	contractType: ContractType.ERC721,
	tokenId: '1',
	itemType: PrimarySaleItemDetailType.individual,
	startDate: '2025-01-01T00:00:00.000Z',
	endDate: '2025-12-31T23:59:59.999Z',
	currencyAddress: zeroAddress,
	priceDecimals: 18,
	priceAmount: '100000000000000000', // 0.1 ETH
	priceAmountFormatted: '0.1',
	supplyCap: '1000',
	createdAt: '2025-01-01T00:00:00.000Z',
	updatedAt: '2025-01-01T00:00:00.000Z',
};

export const mockCollectiblePrimarySaleItem: CollectiblePrimarySaleItem = {
	metadata: mockTokenMetadata,
	primarySaleItem: mockPrimarySaleItem,
};

// Debug configuration
export let isDebugEnabled = false;
export const enableDebug = () => {
	isDebugEnabled = true;
};
export const disableDebug = () => {
	isDebugEnabled = false;
};

// Debug logger function
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

	mockMarketplaceHandler('GetCountOfListingsForCollectible', {
		count: mockCountListingsForCollectible,
	}),

	mockMarketplaceHandler('ListPrimarySaleItems', {
		primarySaleItems: [mockCollectiblePrimarySaleItem],
		page: { page: 1, pageSize: 10, more: false },
	}),

	mockMarketplaceHandler('GetCountOfPrimarySaleItems', {
		count: 1,
	}),
];
