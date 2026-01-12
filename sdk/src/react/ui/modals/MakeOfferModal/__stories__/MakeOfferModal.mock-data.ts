import type {
	Address,
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
import { zeroAddress } from 'viem';

export const MOCK_COLLECTION_ADDRESS =
	'0x1234567890123456789012345678901234567890' as Address;
export const MOCK_ERC1155_COLLECTION_ADDRESS =
	'0x2234567890123456789012345678901234567891' as Address;
export const USDC_ADDRESS =
	'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address;
export const WETH_ADDRESS =
	'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as Address;

const mockCurrencies: Currency[] = [
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

const mockNativeCurrency: Currency = {
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
	openseaOffer: false,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const mockTokenMetadata = {
	tokenId: '1',
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
	tokenId: '42',
	name: 'Semi-Fungible Token #42',
	description: 'An ERC1155 token with multiple copies',
} as unknown as TokenMetadata;

const mockCollection: Collection = {
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

const mockERC1155Collection: Collection = {
	...mockCollection,
	contractAddress: MOCK_ERC1155_COLLECTION_ADDRESS,
	contractType: 'ERC1155',
} as Collection;

const createMockMarketplaceConfig = (
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

const createMockStep = (stepType: StepType): Step =>
	({
		id: stepType,
		data: '0x1234567890abcdef',
		to: MOCK_COLLECTION_ADDRESS,
		value: 0n,
		price: 0n,
	}) as Step;

const createMockSteps = (stepTypes: StepType[]): Step[] =>
	stepTypes.map(createMockStep);

type MockScenario = {
	needsApproval: boolean;
	responseDelay?: number;
	simulateError?: boolean;
	errorMessage?: string;
	collectionType: 'ERC721' | 'ERC1155';
	currencyBalance?: string;
	currencies?: Currency[];
};

const DEFAULT_SCENARIO: MockScenario = {
	needsApproval: true,
	responseDelay: 100,
	simulateError: false,
	collectionType: 'ERC721',
	currencyBalance: '1000000000',
	currencies: mockCurrencies,
};

const createMakeOfferHandlers = (scenario: Partial<MockScenario> = {}) => {
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

		http.post('*/rpc/Marketplace/ListCurrencies', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				currencies: [mockNativeCurrency, ...currencies],
			});
		}),

		http.post('*/rpc/Marketplace/GetCollectible', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				metadata: tokenMetadata,
			});
		}),

		http.post('*/rpc/Marketplace/GetCollectionDetail', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				collection,
			});
		}),

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
				const isSequenceWallet = body?.walletType === WalletKind.sequence;

				const steps =
					!config.needsApproval || isSequenceWallet
						? createMockSteps([StepType.createOffer])
						: createMockSteps([StepType.tokenApproval, StepType.createOffer]);

				return HttpResponse.json({ steps });
			},
		),

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

		http.post('*/rpc/Databeat/Tick', () => {
			return HttpResponse.json({});
		}),

		http.post('*/rpc/Marketplace/GetCollectibleLowestListing', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				order: null,
			});
		}),

		http.post(
			'*/rpc/Marketplace/GetLowestPriceListingForCollectible',
			async () => {
				if (config.responseDelay) await delay(config.responseDelay);
				return HttpResponse.json({
					order: null,
				});
			},
		),

		http.post('*/rpc/Marketplace/GetCollectibleHighestOffer', async () => {
			if (config.responseDelay) await delay(config.responseDelay);
			return HttpResponse.json({
				order: null,
			});
		}),

		http.post('http://127.0.0.1:8545/*', async ({ request }) => {
			try {
				const body = (await request.clone().json()) as {
					method?: string;
					params?: unknown[];
					id?: number;
				};

				if (body.method !== 'eth_call') {
					return undefined;
				}

				const params = body.params as [{ to?: string; data?: string }, string];
				const callData = params?.[0];
				if (!callData?.data) {
					return undefined;
				}

				const selector = callData.data.slice(0, 10).toLowerCase();

				if (selector === '0x70a08231') {
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
					return HttpResponse.json({
						jsonrpc: '2.0',
						id: body.id,
						result:
							'0x0000000000000000000000000000000000000000000000000000000000000006',
					});
				}

				return undefined;
			} catch {
				return undefined;
			}
		}),
	];
};

export const standardWalletHandlers = createMakeOfferHandlers({
	needsApproval: true,
	collectionType: 'ERC721',
});

export const sequenceWalletHandlers = createMakeOfferHandlers({
	needsApproval: false,
	collectionType: 'ERC721',
});

export const erc1155Handlers = createMakeOfferHandlers({
	needsApproval: true,
	collectionType: 'ERC1155',
});

export const insufficientBalanceHandlers = createMakeOfferHandlers({
	needsApproval: true,
	collectionType: 'ERC721',
	currencyBalance: '100',
});

export const errorHandlers = createMakeOfferHandlers({
	needsApproval: true,
	collectionType: 'ERC721',
	simulateError: true,
	errorMessage: 'Insufficient liquidity for this offer',
});

export const slowLoadingHandlers = createMakeOfferHandlers({
	needsApproval: true,
	collectionType: 'ERC721',
	responseDelay: 2000,
});
