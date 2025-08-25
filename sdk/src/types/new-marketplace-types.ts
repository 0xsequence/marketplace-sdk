import type {
	FilterCondition,
	MarketplaceSettings,
	MarketplaceWalletType,
	OpenIdProvider,
} from '../react/_internal/api/builder.gen';
import type { ContractType, OrderbookKind } from './api-types';
import type { CardType } from './types';

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
	itemsAddress: string;
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
	saleAddress: string;
}

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

export interface MetadataFilterRule {
	key: string;
	condition: FilterCondition;
	value?: string;
}

export interface CollectionFilterSettings {
	filterOrder: Array<string>;
	exclusions: Array<MetadataFilterRule>;
}
