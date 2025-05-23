import type {
	FilterCondition,
	MarketplaceWallet as MarketplaceWalletType,
	OpenIdProvider,
} from '../react/_internal/api/builder.gen';
import type { OrderbookKind } from './api-types';

export interface Marketplace {
	projectId: number;
	settings: NewMarketplaceSettings;
	market: MarketPage;
	shop: ShopPage;
}

export interface NewMarketplaceSettings {
	publisherId: string;
	title: string;
	socials: MarketplaceSocials;
	faviconUrl: string;
	walletOptions: MarketplaceWallet;
	logoUrl: string;
	fontUrl?: string;
	accessKey?: string;
}

interface MarketplacePage {
	enabled: boolean;
	title: string;
	bannerUrl: string;
	ogImage?: string;
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

export interface MarketplaceWallet {
	walletType: MarketplaceWalletType;
	oidcIssuers: { [key: string]: string };
	connectors: Array<string>;
	includeEIP6963Wallets: boolean;
	ecosystem?: MarketplaceWalletEcosystem;
	embedded?: MarketplaceWalletEmbedded;
}

export interface MarketplaceWalletEcosystem {
	walletUrl: string;
	walletAppName: string;
	logoLightUrl?: string;
	logoDarkUrl?: string;
}

export interface MarketplaceWalletEmbedded {
	tenantKey: string;
	emailEnabled: boolean;
	providers: Array<OpenIdProvider>;
}

export enum NewMarketplaceType {
	SHOP = 'SHOP',
	MARKET = 'MARKET',
}

interface MarketplaceCollection {
	// contractType: string; // TODO: add this back
	isLAOSERC721: boolean | undefined; // Temporary until builder is updated
	chainId: number;
	bannerUrl: string;
	itemsAddress: string;
	filterSettings?: CollectionFilterSettings;
}

export interface MarketCollection extends MarketplaceCollection {
	marketplaceType: NewMarketplaceType.MARKET;
	feePercentage: number;
	destinationMarketplace: OrderbookKind;
	currencyOptions: Array<string>;
}

export interface ShopCollection extends MarketplaceCollection {
	marketplaceType: NewMarketplaceType.SHOP;
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
