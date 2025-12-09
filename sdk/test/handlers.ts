import { HttpResponse, http } from 'msw';

// Mock data constants
export const MOCK_TOKEN_METADATA = {
	tokenId: 1n,
	contractAddress: '0x1234567890123456789012345678901234567890',
	name: 'Mock NFT #1',
	description: 'A mock NFT for testing ActionButton component',
	image: 'https://example.com/nft.png',
	decimals: 0,
	properties: {
		Type: 'Mock',
		Rarity: 'Common',
	},
	attributes: [
		{ trait_type: 'Type', value: 'Mock' },
		{ trait_type: 'Rarity', value: 'Common' },
	],
};

export const MOCK_CONTRACT_INFO = {
	chainId: 1,
	contractAddress: '0x1234567890123456789012345678901234567890',
	name: 'Mock NFT Collection',
	symbol: 'MOCK',
	type: 'ERC721',
	decimals: 0,
	logoURI: 'https://example.com/collection-logo.png',
	bannerURI: 'https://example.com/collection-banner.png',
	description: 'A mock NFT collection for testing',
	deployed: true,
	bytecodeHash: '0xmockbytecode',
	verified: true,
	extensions: {
		link: 'https://example.com',
		description: 'Mock collection description',
		ogImage: 'https://example.com/og-image.png',
	},
};

export const MOCK_CURRENCIES = [
	{
		chainId: 1,
		contractAddress: '0x0000000000000000000000000000000000000000',
		status: 'active',
		name: 'Ethereum',
		symbol: 'ETH',
		decimals: 18,
		imageUrl: 'https://example.com/eth.png',
		exchangeRate: 1800.0,
		defaultChainCurrency: false,
		nativeCurrency: true,
		createdAt: '2021-01-01T00:00:00.000Z',
		updatedAt: '2021-01-01T00:00:00.000Z',
	},
	{
		chainId: 1,
		contractAddress: '0xA0b86a33E6441986C3d8AC6e89F5e3E0E74733c2',
		status: 'active',
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
		imageUrl: 'https://example.com/usdc.png',
		exchangeRate: 1.0,
		defaultChainCurrency: true,
		nativeCurrency: false,
		createdAt: '2021-01-01T00:00:00.000Z',
		updatedAt: '2021-01-01T00:00:00.000Z',
	},
];

export const MOCK_MARKETPLACE_CONFIG = {
	marketplace: {
		projectId: 1,
		settings: {
			publisherId: 'publisher-1',
			title: 'Mock Marketplace',
			accessKey: 'mock-access-key',
			logoUrl: 'https://example.com/logo.png',
			walletOptions: {
				walletType: 'UNIVERSAL',
				oidcIssuers: {},
				connectors: [],
				includeEIP6963Wallets: true,
			},
		},
		market: {
			enabled: true,
			bannerUrl: 'https://example.com/market-banner.png',
			private: false,
		},
		shop: {
			enabled: true,
			bannerUrl: 'https://example.com/shop-banner.png',
			private: false,
		},
		createdAt: '2021-01-01T00:00:00.000Z',
		updatedAt: '2021-01-01T00:00:00.000Z',
	},
	marketCollections: [
		{
			id: 1,
			projectId: 1,
			contractType: 'ERC721',
			itemsAddress: '0x1234567890123456789012345678901234567890',
			chainId: 1,
			currencyOptions: ['0x0000000000000000000000000000000000000000'],
			bannerUrl: 'https://example.com/collection-banner.png',
			feePercentage: 3.5,
			destinationMarketplace: 'sequence_marketplace_v2',
			filterSettings: {
				filterOrder: ['Type', 'Rarity'],
				exclusions: [],
			},
			createdAt: '2021-01-01T00:00:00.000Z',
			updatedAt: '2021-01-01T00:00:00.000Z',
		},
	],
	shopCollections: [],
};

export const MOCK_LISTING_ORDER = {
	orderId: '0x9876543210987654321098765432109876543210',
	marketplace: 'sequence_marketplace_v1',
	side: 'listing',
	status: 'active',
	chainId: 1,
	originName: 'Sequence',
	collectionContractAddress: '0x1234567890123456789012345678901234567890',
	tokenId: 1n,
	createdBy: '0xabcdef0123456789abcdef0123456789abcdef01',
	priceAmount: '1000000000000000000',
	priceAmountFormatted: '1.0',
	priceAmountNet: '950000000000000000',
	priceAmountNetFormatted: '0.95',
	priceCurrencyAddress: '0x0000000000000000000000000000000000000000',
	priceDecimals: 18,
	priceUSD: 1800.0,
	priceUSDFormatted: '$1,800.00',
	quantityInitial: '1',
	quantityInitialFormatted: '1',
	quantityRemaining: '1',
	quantityRemainingFormatted: '1',
	quantityAvailable: '1',
	quantityAvailableFormatted: '1',
	quantityDecimals: 0,
	feeBps: 500,
	feeBreakdown: [],
	validFrom: '2021-01-01T00:00:00.000Z',
	validUntil: '2021-01-02T00:00:00.000Z',
	blockNumber: 1234567,
	createdAt: '2021-01-01T00:00:00.000Z',
	updatedAt: '2021-01-01T00:00:00.000Z',
};

export const MOCK_OFFER_ORDER = {
	...MOCK_LISTING_ORDER,
	orderId: '0x8765432109876543210987654321098765432109',
	side: 'offer',
	priceAmount: '800000000000000000',
	priceAmountFormatted: '0.8',
	priceAmountNet: '760000000000000000',
	priceAmountNetFormatted: '0.76',
	priceUSD: 1440.0,
	priceUSDFormatted: '$1,440.00',
};

export const MOCK_BALANCES = [
	{
		contractAddress: '0x1234567890123456789012345678901234567890',
		accountAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
		tokenID: '1',
		balance: '1',
		chainId: 1,
		contractType: 'ERC721',
		blockHash: '0x123',
		blockNumber: 1234567,
		updateID: 1,
	},
];

// Organized handlers by service
const metadataHandlers = {
	success: [
		http.post(
			/.*metadata\.sequence\.app\/rpc\/Metadata\/GetTokenMetadata/,
			({ request }) => {
				console.log(
					'MSW: GetTokenMetadata request intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json({
					tokenMetadata: [MOCK_TOKEN_METADATA],
				});
			},
		),

		http.post(
			/.*metadata\.sequence\.app\/rpc\/Metadata\/GetContractInfo/,
			({ request }) => {
				console.log(
					'MSW: GetContractInfo request intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json({
					contractInfo: MOCK_CONTRACT_INFO,
				});
			},
		),
	],

	error: [
		http.post(
			/.*metadata\.sequence\.app\/rpc\/Metadata\/GetTokenMetadata/,
			({ request }) => {
				console.log(
					'MSW: GetTokenMetadata ERROR intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json(
					{ error: { message: 'Token metadata not found' } },
					{ status: 404 },
				);
			},
		),

		http.post(
			/.*metadata\.sequence\.app\/rpc\/Metadata\/GetContractInfo/,
			({ request }) => {
				console.log(
					'MSW: GetContractInfo ERROR intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json(
					{ error: { message: 'Contract not found' } },
					{ status: 404 },
				);
			},
		),
	],
};

const marketplaceHandlers = {
	success: [
		http.post(
			/.*marketplace-api\.sequence\.app\/rpc\/Marketplace\/ListCurrencies/,
			({ request }) => {
				console.log(
					'MSW: ListCurrencies request intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json({
					currencies: MOCK_CURRENCIES,
				});
			},
		),

		http.post(
			/.*marketplace-api\.sequence\.app\/rpc\/Marketplace\/GetCollectible/,
			({ request }) => {
				console.log(
					'MSW: GetCollectible request intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json({
					metadata: MOCK_TOKEN_METADATA,
				});
			},
		),

		http.post(
			/.*marketplace-api\.sequence\.app\/rpc\/Marketplace\/GetCollectibleLowestListing/,
			({ request }) => {
				console.log(
					'MSW: GetLowestPriceListingForCollectible request intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json({
					order: MOCK_LISTING_ORDER,
				});
			},
		),

		http.post(
			/.*marketplace-api\.sequence\.app\/rpc\/Marketplace\/GetCollectibleHighestOffer/,
			({ request }) => {
				console.log(
					'MSW: GetHighestPriceOfferForCollectible request intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json({
					order: MOCK_OFFER_ORDER,
				});
			},
		),
	],

	empty: [
		http.post(
			/.*marketplace-api\.sequence\.app\/rpc\/Marketplace\/GetCollectibleLowestListing/,
			({ request }) => {
				console.log(
					'MSW: GetLowestPriceListingForCollectible EMPTY intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json({
					order: null,
				});
			},
		),

		http.post(
			/.*marketplace-api\.sequence\.app\/rpc\/Marketplace\/GetCollectibleHighestOffer/,
			({ request }) => {
				console.log(
					'MSW: GetHighestPriceOfferForCollectible EMPTY intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json({
					order: null,
				});
			},
		),
	],

	error: [
		http.post(
			/.*marketplace-api\.sequence\.app\/rpc\/Marketplace\/.*/,
			({ request }) => {
				console.log('MSW: Marketplace ERROR intercepted', request.url);
				return HttpResponse.json(
					{ error: { message: 'Marketplace service unavailable' } },
					{ status: 500 },
				);
			},
		),
	],
};

const builderHandlers = {
	success: [
		http.post(
			/.*api\.sequence\.build\/rpc\/MarketplaceService\/LookupMarketplace/,
			({ request }) => {
				console.log(
					'MSW: LookupMarketplace request intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json(MOCK_MARKETPLACE_CONFIG);
			},
		),
	],

	error: [
		http.post(
			/.*api\.sequence\.build\/rpc\/MarketplaceService\/LookupMarketplace/,
			({ request }) => {
				console.log(
					'MSW: LookupMarketplace ERROR intercepted',
					request.headers.get('x-access-key'),
				);
				return HttpResponse.json(
					{ error: { message: 'Marketplace not found' } },
					{ status: 404 },
				);
			},
		),
	],
};

const indexerHandlers = {
	success: [
		http.post(/.*\/rpc\/Indexer\/GetBalances/, ({ request }) => {
			console.log(
				'MSW: GetBalances request intercepted',
				request.headers.get('x-access-key'),
			);
			return HttpResponse.json({
				balances: MOCK_BALANCES,
			});
		}),
	],

	empty: [
		http.post(/.*\/rpc\/Indexer\/GetBalances/, ({ request }) => {
			console.log(
				'MSW: GetBalances EMPTY intercepted',
				request.headers.get('x-access-key'),
			);
			return HttpResponse.json({
				balances: [],
			});
		}),
	],

	error: [
		http.post(/.*\/rpc\/Indexer\/GetBalances/, ({ request }) => {
			console.log(
				'MSW: GetBalances ERROR intercepted',
				request.headers.get('x-access-key'),
			);
			return HttpResponse.json(
				{ error: { message: 'Indexer service unavailable' } },
				{ status: 500 },
			);
		}),
	],
};

// Utility handlers
const utilityHandlers = {
	catchAll: [
		http.all(/.*/, ({ request }) => {
			const url = new URL(request.url);
			if (
				url.hostname.includes('sequence.app') ||
				url.hostname.includes('sequence.build')
			) {
				console.log(
					'MSW: Unhandled request to Sequence API:',
					request.method,
					request.url,
				);
				return HttpResponse.json({ success: true }, { status: 200 });
			}
			return undefined;
		}),
	],
};

// Pre-composed handler sets for common scenarios
export const defaultHandlers = {
	success: [
		...metadataHandlers.success,
		...marketplaceHandlers.success,
		...builderHandlers.success,
		...indexerHandlers.success,
		...utilityHandlers.catchAll,
	],

	error: [
		...metadataHandlers.error,
		...marketplaceHandlers.error,
		...builderHandlers.error,
		...indexerHandlers.error,
		...utilityHandlers.catchAll,
	],

	mixed: [
		...metadataHandlers.success,
		...marketplaceHandlers.empty, // No listings/offers
		...builderHandlers.success,
		...indexerHandlers.empty, // No balance (user doesn't own)
		...utilityHandlers.catchAll,
	],
};

// Export individual services for granular control
export {
	metadataHandlers,
	marketplaceHandlers,
	builderHandlers,
	indexerHandlers,
	utilityHandlers,
};
