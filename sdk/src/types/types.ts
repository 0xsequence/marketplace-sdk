import type {
	ContractType,
	Currency,
	FilterCondition,
	MarketplaceSettings,
	MarketplaceWalletType,
	OpenIdProvider,
	OrderbookKind,
} from '@0xsequence/marketplace-api';
import type { Address } from 'viem';

// ============================================================================
// Marketplace Configuration
// ============================================================================

export interface MarketplaceConfig {
	projectId: number;
	settings: MarketplaceSettings;
	market: MarketPage;
	shop: ShopPage;
}

interface MarketplacePage {
	enabled: boolean;
	bannerUrl: string;
	ogImage?: string;
	private: boolean;
}

export interface MarketPage extends MarketplacePage {
	collections: MarketCollection[];
}

export interface ShopPage extends MarketplacePage {
	collections: ShopCollection[];
}

export interface MarketplaceSocials {
	twitter: string;
	discord: string;
	website: string;
	tiktok: string;
	instagram: string;
	youtube: string;
}

interface MarketplaceCollection {
	chainId: number;
	bannerUrl: string;
	itemsAddress: Address;
	filterSettings?: CollectionFilterSettings;
	sortOrder?: number;
	private: boolean;
}

export interface MarketCollection extends MarketplaceCollection {
	cardType: CardType;
	contractType: ContractType; //TODO: This should be added to the shop collection too in builder.gen.ts. Then update shop collections map from prefetchedMarketplaceSettings in "sdk/src/react/queries/marketplaceConfig.ts"
	feePercentage: number;
	destinationMarketplace: OrderbookKind;
	currencyOptions: Array<string>;
}

export interface ShopCollection extends MarketplaceCollection {
	cardType: CardType;
	saleAddress: Address;
}

// ============================================================================
// Wallet Configuration
// ============================================================================

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

// ============================================================================
// Filtering & Metadata
// ============================================================================

export interface MetadataFilterRule {
	key: string;
	condition: FilterCondition;
	value?: string;
}

export interface CollectionFilterSettings {
	filterOrder: Array<string>;
	exclusions: Array<MetadataFilterRule>;
}

// ============================================================================
// UI Types
// ============================================================================

export type Price = {
	amountRaw: bigint;
	currency: Currency;
};

export type CardType = 'market' | 'shop' | 'inventory-non-tradable';

export enum CollectibleCardAction {
	BUY = 'Buy',
	SELL = 'Sell',
	LIST = 'Create listing',
	OFFER = 'Make an offer',
	TRANSFER = 'Transfer',
}
