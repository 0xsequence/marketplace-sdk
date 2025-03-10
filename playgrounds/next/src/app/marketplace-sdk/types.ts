export interface OpenIdProvider {
	iss: string;
	aud: Array<string>;
}

export interface MarketplaceSocials {
	twitter: string;
	discord: string;
	website: string;
	tiktok: string;
	instagram: string;
	youtube: string;
}

export enum MarketplaceWallet {
	UNIVERSAL = 'UNIVERSAL',
	EMBEDDED = 'EMBEDDED',
}

export interface MarketplaceWalletOptions {
	walletType: MarketplaceWallet;
	oidcIssuers?: Record<string, string>;
	connectors: Array<string>;
	includeEIP6963Wallets: boolean;
}

export interface MarketplaceCollection {
	marketplaceType: MarketplaceType;
	chainId: number;
	address: string;
	exchanges: Array<string>;
	bannerUrl: string;
	feePercentage: number;
	currencyOptions: Array<string>;
	destinationMarketplace: OrderbookKind;
	filterSettings?: CollectionFilterSettings;
}

export enum MarketplaceType {
	AMM = 'AMM',
	P2P = 'P2P',
	SEQUENCE = 'SEQUENCE',
	ORDERBOOK = 'ORDERBOOK',
}

export enum OrderbookKind {
	unknown = 'unknown',
	sequence_marketplace_v1 = 'sequence_marketplace_v1',
	sequence_marketplace_v2 = 'sequence_marketplace_v2',
	blur = 'blur',
	opensea = 'opensea',
	looks_rare = 'looks_rare',
	reservoir = 'reservoir',
	x2y2 = 'x2y2',
}

export enum FilterCondition {
	ENTIRE_KEY = 'ENTIRE_KEY',
	SPECIFIC_VALUE = 'SPECIFIC_VALUE',
}

export interface MetadataFilterRule {
	key: string;
	condition: FilterCondition;
	value?: string;
}

export interface CollectionFilterSettings {
	filterOrder: Array<string>;
	exclusions: Array<MetadataFilterRule>;
}

export interface MarketplaceSettings {
	publisherId: string;
	title: string;
	shortDescription: string;
	socials: MarketplaceSocials;
	faviconUrl: string;
	landingBannerUrl: string;
	collections: Array<MarketplaceCollection>;
	walletOptions: MarketplaceWalletOptions;
	landingPageLayout: string;
	logoUrl: string;
	bannerUrl: string;
	fontUrl?: string;
	ogImage?: string;
}

export interface ExtendedMarketplaceConfig {
	projectId: number;
	config: MarketplaceSettings;
	accessKey: string;
	waasEmailEnabled: boolean;
	waasTenantKey: string;
	waasProviders: Array<OpenIdProvider>;
}

export interface GetExtendedMarketplaceConfigReturn {
	config: ExtendedMarketplaceConfig;
}
