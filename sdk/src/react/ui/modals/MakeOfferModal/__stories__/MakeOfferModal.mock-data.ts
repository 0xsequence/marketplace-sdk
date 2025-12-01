/**
 * Mock data and MSW handlers for MakeOfferModal Storybook stories
 *
 * This module provides configurable mock data and handlers to test
 * different scenarios of the Make Offer flow.
 */

import type {
	Collection,
	Currency,
	LookupMarketplaceReturn,
	Step,
	TokenMetadata,
} from '@0xsequence/api-client';
import {
	CollectionStatus,
	CurrencyStatus,
	MarketplaceWalletType,
	MetadataStatus,
	OrderbookKind,
	StepType,
	WalletKind,
} from '@0xsequence/api-client';
import { delay, HttpResponse, http } from 'msw';
import type { Address } from 'viem';
import { zeroAddress } from 'viem';

// ============================================================================
// MOCK ADDRESSES
// ============================================================================

export const MOCK_COLLECTION_ADDRESS =
	'0x1234567890123456789012345678901234567890' as Address;
export const MOCK_ERC1155_COLLECTION_ADDRESS =
	'0x2234567890123456789012345678901234567891' as Address;
export const USDC_ADDRESS =
	'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address;
export const WETH_ADDRESS =
	'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as Address;

// ============================================================================
// MOCK CURRENCIES
// ============================================================================

export const mockCurrencies: Currency[] = [
	{
		chainId: 1,
		contractAddress: USDC_ADDRESS,
		status: CurrencyStatus.active,
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
		imageUrl:
			'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
		exchangeRate: 1.0,
		defaultChainCurrency: true,
		nativeCurrency: false,
		openseaListing: true,
		openseaOffer: true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		chainId: 1,
		contractAddress: WETH_ADDRESS,
		status: CurrencyStatus.active,
		name: 'Wrapped Ether',
		symbol: 'WETH',
		decimals: 18,
		imageUrl: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
		exchangeRate: 2500.0,
		defaultChainCurrency: false,
		nativeCurrency: false,
		openseaListing: true,
		openseaOffer: true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

// Native ETH - not valid for offers (offers require ERC20)
export const mockNativeCurrency: Currency = {
	chainId: 1,
	contractAddress: zeroAddress,
	status: CurrencyStatus.active,
	name: 'Ethereum',
	symbol: 'ETH',
	decimals: 18,
	imageUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
	exchangeRate: 2500.0,
	defaultChainCurrency: false,
	nativeCurrency: true,
	openseaListing: true,
	openseaOffer: false, // Native currency cannot be used for offers
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

// ============================================================================
// MOCK TOKEN METADATA
// ============================================================================

export const mockTokenMetadata = {
	tokenId: '1', // Use string for JSON serialization in MSW handlers
	name: 'Cool NFT #1',
	description: 'A very cool NFT for testing the Make Offer flow',
	image: 'https://picsum.photos/seed/nft1/400/400',
	attributes: [
		{ trait_type: 'Background', value: 'Blue' },
		{ trait_type: 'Rarity', value: 'Rare' },
	],
	status: MetadataStatus.AVAILABLE,
} as unknown as TokenMetadata;

export const mockERC1155TokenMetadata = {
	...mockTokenMetadata,
	tokenId: '42', // Use string for JSON serialization in MSW handlers
	name: 'Semi-Fungible Token #42',
	description: 'An ERC1155 token with multiple copies',
} as unknown as TokenMetadata;

// ============================================================================
// MOCK COLLECTION
// ============================================================================

export const mockCollection: Collection = {
	status: CollectionStatus.active,
	chainId: 1,
	contractAddress: MOCK_COLLECTION_ADDRESS,
	contractType: 'ERC721',
	tokenQuantityDecimals: 0,
	config: {
		lastSynced: {},
		collectiblesSynced: new Date().toISOString(),
		activitiesSynced: new Date().toISOString(),
		activitiesSyncedContinuity: new Date().toISOString(),
	},
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
} as Collection;

export const mockERC1155Collection: Collection = {
	...mockCollection,
	contractAddress: MOCK_ERC1155_COLLECTION_ADDRESS,
	contractType: 'ERC1155',
} as Collection;

// ============================================================================
// MOCK MARKETPLACE CONFIG
// ============================================================================

export const createMockMarketplaceConfig = (
	options: {
		collectionAddress?: Address;
		contractType?: 'ERC721' | 'ERC1155';
		currencies?: Currency[];
	} = {},
): LookupMarketplaceReturn => {
	const {
		collectionAddress = MOCK_COLLECTION_ADDRESS,
		contractType = 'ERC721',
		currencies = mockCurrencies,
	} = options;

	return {
		marketplace: {
			projectId: 1,
			settings: {
				style: {},
				publisherId: 'test-publisher',
				title: 'Test Marketplace',
				socials: {
					twitter: '',
					discord: '',
					website: '',
					tiktok: '',
					instagram: '',
					youtube: '',
				},
				faviconUrl: '',
				walletOptions: {
					walletType: MarketplaceWalletType.UNIVERSAL,
					oidcIssuers: {},
					connectors: [],
					includeEIP6963Wallets: true,
				},
				logoUrl: '',
				fontUrl: '',
				accessKey: 'test-access-key',
			},
			market: {
				enabled: true,
				bannerUrl: '',
				ogImage: '',
			},
			shop: {
				enabled: false,
				bannerUrl: '',
				ogImage: '',
			},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		marketCollections: [
			{
				id: 1,
				projectId: 1,
				chainId: 1,
				itemsAddress: collectionAddress,
				contractType,
				bannerUrl: '',
				feePercentage: 2.5,
				currencyOptions: currencies.map((c) => c.contractAddress),
				destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
				filterSettings: {
					filterOrder: [],
					exclusions: [],
				},
				private: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		],
		shopCollections: [],
	} as unknown as LookupMarketplaceReturn;
};

// ============================================================================
// MOCK STEPS (Transaction Steps)
// ============================================================================

export const createMockStep = (stepType: StepType): Step =>
	({
		id: stepType,
		data: '0x1234567890abcdef',
		to: MOCK_COLLECTION_ADDRESS,
		value: '0', // Use string for JSON serialization in MSW handlers
		price: '0', // Use string for JSON serialization in MSW handlers
	}) as Step;

export const createMockSteps = (stepTypes: StepType[]): Step[] =>
	stepTypes.map(createMockStep);

// ============================================================================
// MSW HANDLER FACTORIES
// ============================================================================

export type MockScenario = {
	/** Whether the wallet needs approval (EOA wallets need it, Sequence/WaaS don't) */
	needsApproval: boolean;
	/** Delay in ms for API responses (to show loading states) */
	responseDelay?: number;
	/** Whether to simulate an error */
	simulateError?: boolean;
	/** Error message to show */
	errorMessage?: string;
	/** Collection type */
	collectionType: 'ERC721' | 'ERC1155';
	/** User's balance of the offer currency */
	currencyBalance?: string;
	/** Available currencies for offers */
	currencies?: Currency[];
};

const DEFAULT_SCENARIO: MockScenario = {
	needsApproval: true,
	responseDelay: 100,
	simulateError: false,
	collectionType: 'ERC721',
	currencyBalance: '1000000000', // 1000 USDC (6 decimals)
	currencies: mockCurrencies,
};

/**
 * Creates MSW handlers for the Make Offer flow
 */
export const createMakeOfferHandlers = (
	scenario: Partial<MockScenario> = {},
) => {
	const config = { ...DEFAULT_SCENARIO, ...scenario };
	const collectionAddress =
		config.collectionType === 'ERC1155'
			? MOCK_ERC1155_COLLECTION_ADDRESS
			: MOCK_COLLECTION_ADDRESS;

	const tokenMetadata =
		config.collectionType === 'ERC1155'
			? mockERC1155TokenMetadata
			: mockTokenMetadata;

	const collection =
		config.collectionType === 'ERC1155'
			? mockERC1155Collection
			: mockCollection;

	const currencies = config.currencies || mockCurrencies;

	return [
		// Marketplace Config
		http.post('*/rpc/MarketplaceService/LookupMarketplace', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json(
				createMockMarketplaceConfig({
					collectionAddress,
					contractType: config.collectionType,
					currencies,
				}),
			);
		}),

		// List Currencies
		http.post('*/rpc/Marketplace/ListCurrencies', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				currencies: [mockNativeCurrency, ...currencies],
			});
		}),

		// Get Collectible
		http.post('*/rpc/Marketplace/GetCollectible', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				metadata: tokenMetadata,
			});
		}),

		// Get Collection Detail
		http.post('*/rpc/Marketplace/GetCollectionDetail', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				collection,
			});
		}),

		// Generate Offer Transaction - KEY HANDLER
		// Sequence/WaaS wallets don't need approval, EOA wallets do
		http.post(
			'*/rpc/Marketplace/GenerateOfferTransaction',
			async ({ request }: { request: Request }) => {
				if (config.responseDelay) await delay(config.responseDelay);

				if (config.simulateError) {
					return HttpResponse.json(
						{
							error: {
								message:
									config.errorMessage || 'Failed to generate offer transaction',
							},
						},
						{ status: 500 },
					);
				}

				const body = (await request.json()) as { walletType?: WalletKind };

				// Sequence wallets (including WaaS/embedded) don't need approval
				// WaaS is identified as 'sequence' wallet type
				const isSequenceWallet = body?.walletType === WalletKind.sequence;

				// If scenario says no approval OR it's a Sequence wallet, skip approval
				const steps =
					!config.needsApproval || isSequenceWallet
						? createMockSteps([StepType.createOffer])
						: createMockSteps([StepType.tokenApproval, StepType.createOffer]);

				return HttpResponse.json({ steps });
			},
		),

		// Execute (submit the offer)
		http.post('*/rpc/Marketplace/Execute', async () => {
			if (config.responseDelay) await delay(config.responseDelay);

			if (config.simulateError) {
				return HttpResponse.json(
					{
						error: {
							message: config.errorMessage || 'Failed to execute offer',
						},
					},
					{ status: 500 },
				);
			}

			return HttpResponse.json({
				orderId: `0x${'a'.repeat(64)}`,
			});
		}),

		// Token Balances (for currency balance check)
		http.post('*/rpc/Indexer/GetTokenBalances', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				page: { page: 1, pageSize: 10, more: false },
				balances: [
					{
						contractType: 'ERC20',
						contractAddress: USDC_ADDRESS,
						accountAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
						tokenID: '0',
						balance: config.currencyBalance || '1000000000',
						blockHash: `0x${'a'.repeat(64)}`,
						blockNumber: 1234567,
						chainId: 1,
						uniqueCollectibles: '0',
						isSummary: false,
					},
				],
			});
		}),

		// Metadata endpoints
		http.post('*/rpc/Metadata/GetContractInfo', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				contractInfo: {
					chainId: 1,
					address: collectionAddress,
					name:
						config.collectionType === 'ERC1155'
							? 'Test ERC1155 Collection'
							: 'Test NFT Collection',
					type: config.collectionType,
					symbol: 'TEST',
					decimals: 0,
					logoURI: 'https://picsum.photos/seed/collection/100/100',
					deployed: true,
					bytecodeHash: '0x',
					extensions: {
						link: '',
						description: 'A test collection',
						ogImage: '',
					},
				},
			});
		}),

		http.post('*/rpc/Metadata/GetTokenMetadata', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				tokenMetadata: [tokenMetadata],
			});
		}),

		// Databeat analytics
		http.post('*/rpc/Databeat/Tick', () => {
			return HttpResponse.json({});
		}),

		// Lowest listing (for floor price comparison) - both endpoints for compatibility
		http.post('*/rpc/Marketplace/GetCollectibleLowestListing', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				order: null, // No existing listing
			});
		}),

		http.post(
			'*/rpc/Marketplace/GetLowestPriceListingForCollectible',
			async () => {
				if (config.responseDelay) await delay(config.responseDelay);
				return HttpResponse.json({
					order: null, // No existing listing
				});
			},
		),

		// Highest offer (for comparison)
		http.post('*/rpc/Marketplace/GetCollectibleHighestOffer', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				order: null, // No existing offers
			});
		}),

		// JSON-RPC handler for wagmi eth_call (balanceOf, decimals)
		// This mocks the direct blockchain calls for ERC-20 balance checking
		// Explicit pattern for localhost Anvil endpoints
		http.post('http://127.0.0.1:8545/*', async ({ request }) => {
			try {
				const body = (await request.clone().json()) as {
					method?: string;
					params?: unknown[];
					id?: number;
				};

				// Only handle eth_call requests
				if (body.method !== 'eth_call') {
					return undefined; // Pass through to other handlers
				}

				const params = body.params as [{ to?: string; data?: string }, string];
				const callData = params?.[0];
				if (!callData?.data) {
					return undefined;
				}

				// balanceOf selector: 0x70a08231
				// decimals selector: 0x313ce567
				const selector = callData.data.slice(0, 10).toLowerCase();

				if (selector === '0x70a08231') {
					// balanceOf - return mock balance
					// Pad balance to 32 bytes (64 hex chars)
					const balanceHex = BigInt(
						config.currencyBalance || '1000000000',
					).toString(16);
					const paddedBalance = balanceHex.padStart(64, '0');

					return HttpResponse.json({
						jsonrpc: '2.0',
						id: body.id,
						result: `0x${paddedBalance}`,
					});
				}

				if (selector === '0x313ce567') {
					// decimals - return 6 for USDC
					return HttpResponse.json({
						jsonrpc: '2.0',
						id: body.id,
						result:
							'0x0000000000000000000000000000000000000000000000000000000000000006',
					});
				}

				return undefined;
			} catch {
				return undefined; // Not JSON, pass through
			}
		}),
	];
};

// ============================================================================
// PRE-CONFIGURED SCENARIOS
// ============================================================================

/** Standard EOA wallet - requires approval step */
export const standardWalletHandlers = createMakeOfferHandlers({
	needsApproval: true,
	collectionType: 'ERC721',
});

/** Sequence/WaaS wallet - no approval needed */
export const sequenceWalletHandlers = createMakeOfferHandlers({
	needsApproval: false,
	collectionType: 'ERC721',
});

/** ERC1155 collection - shows quantity input */
export const erc1155Handlers = createMakeOfferHandlers({
	needsApproval: true,
	collectionType: 'ERC1155',
});

/** Insufficient balance scenario */
export const insufficientBalanceHandlers = createMakeOfferHandlers({
	needsApproval: true,
	collectionType: 'ERC721',
	currencyBalance: '100', // Only 0.0001 USDC
});

/** Error scenario */
export const errorHandlers = createMakeOfferHandlers({
	needsApproval: true,
	collectionType: 'ERC721',
	simulateError: true,
	errorMessage: 'Insufficient liquidity for this offer',
});

/** Slow loading scenario (for testing loading states) */
export const slowLoadingHandlers = createMakeOfferHandlers({
	needsApproval: true,
	collectionType: 'ERC721',
	responseDelay: 2000,
});
