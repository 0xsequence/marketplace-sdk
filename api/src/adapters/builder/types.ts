/**
 * Normalized Builder Types
 *
 * These are the normalized versions with bigint primitives.
 */

import type { ChainId, ProjectId, TokenId } from '../../types/primitives';
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

// Normalized types with bigint

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
	market: MarketplacePage;
	shop: MarketplacePage;
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

export interface MarketCollection {
	id: number;
	projectId: ProjectId;
	chainId: ChainId;
	itemsAddress: string;
	contractType: string;
	bannerUrl: string;
	feePercentage: number;
	currencyOptions: string[];
	destinationMarketplace: string;
	filterSettings?: CollectionFilterSettings;
	sortOrder?: number;
	private: boolean;
	createdAt?: string;
	updatedAt?: string;
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

export interface ShopCollection {
	id: number;
	projectId: ProjectId;
	chainId: ChainId;
	itemsAddress: string;
	saleAddress: string;
	name: string;
	bannerUrl: string;
	tokenIds: TokenId[];
	customTokenIds: TokenId[];
	sortOrder?: number;
	private: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface MarketplaceService {
	lookupMarketplace(
		args: LookupMarketplaceArgs,
		headers?: object,
		signal?: AbortSignal,
	): Promise<LookupMarketplaceReturn>;
}
