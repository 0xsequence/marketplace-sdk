// Normalized Builder Types

import type { ContractType } from '@0xsequence/indexer';
import type {
	Address,
	ChainId,
	ProjectId,
	TokenId,
} from '../../types/primitives';
import type { OrderbookKind } from '../marketplace';
import type { FilterCondition, MarketplaceWalletType } from './builder.gen';

export {
	FilterCondition,
	MarketplaceWalletType,
	WebrpcBadMethodError,
	WebrpcBadRequestError,
	WebrpcBadResponseError,
	WebrpcBadRouteError,
	WebrpcClientDisconnectedError,
	WebrpcEndpointError,
	WebrpcError,
	WebrpcInternalErrorError,
	WebrpcRequestFailedError,
	WebrpcServerPanicError,
	WebrpcStreamFinishedError,
	WebrpcStreamLostError,
} from './builder.gen';

export interface LookupMarketplaceArgs {
	projectId?: ProjectId;
	domain?: string;
	userAddress?: string;
}

export interface LookupMarketplaceReturn {
	marketplace: Marketplace;
	marketCollections: MarketCollection[];
	shopCollections: ShopCollection[];
}

export interface Marketplace {
	projectId: ProjectId;
	settings: MarketplaceSettings;
	market: MarketPage;
	shop: ShopPage;
	createdAt?: string;
	updatedAt?: string;
}

export interface MarketplaceSettings {
	// biome-ignore lint/suspicious/noExplicitAny: Style object accepts arbitrary CSS properties
	style: { [key: string]: any };
	publisherId: string;
	title: string;
	socials: MarketplaceSocials;
	faviconUrl: string;
	walletOptions: MarketplaceWallet;
	logoUrl: string;
	fontUrl: string;
	accessKey?: string;
}

export interface MarketplacePage {
	enabled: boolean;
	bannerUrl: string;
	ogImage: string;
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

export interface MarketplaceWallet {
	walletType: MarketplaceWalletType;
	oidcIssuers: { [key: string]: string };
	connectors: string[];
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
	providers: OpenIdProvider[];
}

export interface OpenIdProvider {
	iss: string;
	aud: string[];
}

interface BaseMarketplaceCollection {
	id: number;
	projectId: ProjectId;
	chainId: ChainId;
	itemsAddress: Address;
	bannerUrl: string;
	sortOrder?: number;
	private: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface MarketCollection extends BaseMarketplaceCollection {
	marketplaceCollectionType: 'market';
	contractType: ContractType;
	feePercentage: number;
	currencyOptions: string[];
	destinationMarketplace: OrderbookKind;
	filterSettings?: CollectionFilterSettings;
}

export interface CollectionFilterSettings {
	filterOrder: string[];
	exclusions: MetadataFilterRule[];
}

export interface MetadataFilterRule {
	key: string;
	condition: FilterCondition;
	value?: string;
}

export interface ShopCollection extends BaseMarketplaceCollection {
	marketplaceCollectionType: 'shop';
	saleAddress: Address;
	name: string;
	tokenIds: TokenId[];
	customTokenIds: TokenId[];
}

export type MarketplaceCollection = MarketCollection | ShopCollection;

export interface MarketplaceService {
	lookupMarketplace(
		args: LookupMarketplaceArgs,
		headers?: object,
		signal?: AbortSignal,
	): Promise<LookupMarketplaceReturn>;
}
