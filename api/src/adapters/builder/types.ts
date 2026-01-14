import type { ContractType } from '@0xsequence/indexer';
import type {
	Address,
	ChainId,
	ProjectId,
	TokenId,
} from '../../types/primitives';
import type { OrderbookKind } from '../marketplace';
import type {
	FilterCondition,
	CollectionFilterSettings as GenCollectionFilterSettings,
	LookupMarketplaceArgs as GenLookupMarketplaceArgs,
	LookupMarketplaceReturn as GenLookupMarketplaceReturn,
	MarketCollection as GenMarketCollection,
	Marketplace as GenMarketplace,
	MarketplacePage as GenMarketplacePage,
	MarketplaceService as GenMarketplaceService,
	MarketplaceSettings as GenMarketplaceSettings,
	MarketplaceSocials as GenMarketplaceSocials,
	MarketplaceWallet as GenMarketplaceWallet,
	MarketplaceWalletEcosystem as GenMarketplaceWalletEcosystem,
	MarketplaceWalletEmbedded as GenMarketplaceWalletEmbedded,
	MetadataFilterRule as GenMetadataFilterRule,
	OpenIdProvider as GenOpenIdProvider,
	ShopCollection as GenShopCollection,
} from './builder.gen';

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

export type LookupMarketplaceArgs = Omit<
	GenLookupMarketplaceArgs,
	'projectId' | 'userAddress'
> & {
	projectId?: ProjectId;
	userAddress?: Address;
};

export type LookupMarketplaceReturn = Omit<
	GenLookupMarketplaceReturn,
	'marketplace' | 'marketCollections' | 'shopCollections'
> & {
	marketplace: Marketplace;
	marketCollections: MarketCollection[];
	shopCollections: ShopCollection[];
};

export type Marketplace = Omit<
	GenMarketplace,
	'projectId' | 'market' | 'shop'
> & {
	projectId: ProjectId;
	market: MarketPage;
	shop: ShopPage;
};

export type MarketplaceSettings = Omit<
	GenMarketplaceSettings,
	'style' | 'walletOptions'
> & {
	style: Record<string, unknown>;
	walletOptions: MarketplaceWallet;
};

export type MarketplacePage = GenMarketplacePage;

export type MarketPage = MarketplacePage & {
	collections: MarketCollection[];
};

export type ShopPage = MarketplacePage & {
	collections: ShopCollection[];
};

export type MarketplaceSocials = GenMarketplaceSocials;

export type MarketplaceWallet = Omit<
	GenMarketplaceWallet,
	'ecosystem' | 'embedded'
> & {
	ecosystem?: MarketplaceWalletEcosystem;
	embedded?: MarketplaceWalletEmbedded;
};

export type MarketplaceWalletEcosystem = GenMarketplaceWalletEcosystem;

export type MarketplaceWalletEmbedded = Omit<
	GenMarketplaceWalletEmbedded,
	'providers'
> & {
	providers: OpenIdProvider[];
};

export type OpenIdProvider = GenOpenIdProvider;

export type CollectionFilterSettings = Omit<
	GenCollectionFilterSettings,
	'exclusions'
> & {
	exclusions: MetadataFilterRule[];
};

export type MetadataFilterRule = Omit<GenMetadataFilterRule, 'condition'> & {
	condition: FilterCondition;
};

export type MarketCollection = Omit<
	GenMarketCollection,
	| 'projectId'
	| 'chainId'
	| 'itemsAddress'
	| 'contractType'
	| 'destinationMarketplace'
	| 'filterSettings'
> & {
	marketplaceCollectionType: 'market';
	projectId: ProjectId;
	chainId: ChainId;
	itemsAddress: Address;
	contractType: ContractType;
	destinationMarketplace: OrderbookKind;
	filterSettings?: CollectionFilterSettings;
};

export type ShopCollection = Omit<
	GenShopCollection,
	| 'projectId'
	| 'chainId'
	| 'itemsAddress'
	| 'saleAddress'
	| 'tokenIds'
	| 'customTokenIds'
> & {
	marketplaceCollectionType: 'shop';
	projectId: ProjectId;
	chainId: ChainId;
	itemsAddress: Address;
	saleAddress: Address;
	tokenIds: TokenId[];
	customTokenIds: TokenId[];
};

export type MarketplaceCollection = MarketCollection | ShopCollection;

export type MarketplaceService = GenMarketplaceService;
