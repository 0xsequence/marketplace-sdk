import type {
	Currency,
	FilterCondition,
	MarketCollection,
	MarketPage,
	MarketplaceCollection,
	MarketplaceSettings,
	MarketplaceWalletType,
	OpenIdProvider,
	ShopCollection,
	ShopPage,
} from '@0xsequence/api-client';

// Re-export collection types from API - these are the source of truth
export type {
	MarketCollection,
	MarketPage,
	MarketplaceCollection,
	ShopCollection,
	ShopPage,
};

// Marketplace Configuration

export interface MarketplaceConfig {
	projectId: number;
	settings: MarketplaceSettings;
	market: MarketPage;
	shop: ShopPage;
}

/**
 * Type guard to check if a collection is a ShopCollection
 * Shop collections are for primary sales
 */
export function isShopCollection(
	collection: MarketplaceCollection,
): collection is ShopCollection {
	return collection.marketplaceCollectionType === 'shop';
}

/**
 * Type guard to check if a collection is a MarketCollection
 * Market collections are for secondary market trading
 */
export function isMarketCollection(
	collection: MarketplaceCollection,
): collection is MarketCollection {
	return collection.marketplaceCollectionType === 'market';
}

// Wallet Configuration

export interface EcosystemWalletSettings {
	walletUrl: string;
	walletAppName: string;
	logoLightUrl?: string;
	logoDarkUrl?: string;
}

export interface MarketplaceWalletOptions {
	walletType: MarketplaceWalletType;
	oidcIssuers: { [key: string]: string };
	connectors: Array<string>;
	includeEIP6963Wallets: boolean;
	ecosystem?: EcosystemWalletSettings;
	waas?: MarketplaceWalletWaasSettings;
}

export interface MarketplaceWalletWaasSettings {
	tenantKey: string;
	emailEnabled: boolean;
	providers: Array<OpenIdProvider>;
}

// Filtering & Metadata

export interface MetadataFilterRule {
	key: string;
	condition: FilterCondition;
	value?: string;
}

export interface CollectionFilterSettings {
	filterOrder: Array<string>;
	exclusions: Array<MetadataFilterRule>;
}

// UI Types

export type Price = {
	amountRaw: bigint;
	currency: Currency;
};

/**
 * Card type for UI rendering
 * Note: For collections, use type guards (isShopCollection/isMarketCollection) instead
 */
export type CardType = 'market' | 'shop' | 'inventory-non-tradable';

export enum CollectibleCardAction {
	BUY = 'Buy',
	SELL = 'Sell',
	LIST = 'Create listing',
	OFFER = 'Make an offer',
	TRANSFER = 'Transfer',
}
