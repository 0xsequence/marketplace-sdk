import type { OrderbookKind } from '../react/_internal/api/marketplace.gen';

// Manual copy of the types from builder
export enum MarketplaceWallet {
	UNIVERSAL = 'UNIVERSAL',
	EMBEDDED = 'EMBEDDED',
	ECOSYSTEM = 'ECOSYSTEM',
}

export enum FilterCondition {
	ENTIRE_KEY = 'ENTIRE_KEY',
	SPECIFIC_VALUE = 'SPECIFIC_VALUE',
}

export enum MarketplaceType { // This is only used for marketplace v1
	AMM = 'AMM',
	P2P = 'P2P',
	SEQUENCE = 'SEQUENCE',
	ORDERBOOK = 'ORDERBOOK',
}

export interface EcosystemWalletSettings {
	walletUrl: string;
	walletAppName: string;
	logoLightUrl?: string;
	logoDarkUrl?: string;
}
export interface MarketplaceWalletOptions {
	walletType: MarketplaceWallet;
	oidcIssuers: { [key: string]: string };
	connectors: Array<string>;
	includeEIP6963Wallets: boolean;
	ecosystem?: EcosystemWalletSettings;
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

export interface MarketplaceSocials {
	twitter: string;
	discord: string;
	website: string;
	tiktok: string;
	instagram: string;
	youtube: string;
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

export interface MarketplaceConfig extends MarketplaceSettings {
	cssString: string;
	manifestUrl: string;
}
