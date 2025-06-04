import { createStore } from '@xstate/store';
import type {
	ApiConfig,
	ContractType,
	MarketplaceConfig,
	OrderbookKind,
	SdkConfig,
} from '../../../../sdk/src';
import type { MarketplaceType } from '../../../../sdk/src/types/new-marketplace-types';
import {
	DEFAULT_ACTIVE_TAB,
	DEFAULT_CHAIN_ID,
	DEFAULT_COLLECTIBLE_ID,
	DEFAULT_COLLECTION_ADDRESS,
	DEFAULT_MARKETPLACE_TYPE,
	DEFAULT_PAGINATION_MODE,
	DEFAULT_PROJECT_ACCESS_KEY,
	DEFAULT_PROJECT_ID,
	DEFAULT_WALLET_TYPE,
	STORAGE_KEY,
} from '../consts';
import type { PaginationMode, Tab } from '../types';

export type ApiOverrides = {
	builder?: ApiConfig;
	marketplace?: ApiConfig;
	nodeGateway?: ApiConfig;
	metadata?: ApiConfig;
	indexer?: ApiConfig;
	sequenceApi?: ApiConfig;
	sequenceWallet?: ApiConfig;
};

// Local type definitions for overrides
export type CollectionOverride = {
	chainId: number;
	contractAddress: string;
	name?: string;
	symbol?: string;
	description?: string;
	bannerUrl?: string;
	ogImage?: string;
	contractType?: ContractType;
	feePercentage?: number;
	currencyOptions?: string[];
	saleAddress?: string;
};

// Extended SdkConfig with local overrides
export type ExtendedSdkConfig = SdkConfig & {
	_internal?: SdkConfig['_internal'] & {
		overrides?: {
			marketplaceConfig?: Partial<MarketplaceConfig>;
			api?: ApiOverrides;
			collections?: CollectionOverride[];
		};
	};
};

const defaultContext = {
	collectionAddress: DEFAULT_COLLECTION_ADDRESS,
	chainId: DEFAULT_CHAIN_ID,
	collectibleId: DEFAULT_COLLECTIBLE_ID,
	activeTab:
		typeof window !== 'undefined'
			? ((window.location.pathname.slice(1) || DEFAULT_ACTIVE_TAB) as Tab)
			: DEFAULT_ACTIVE_TAB,
	projectId: DEFAULT_PROJECT_ID,
	walletType: DEFAULT_WALLET_TYPE,
	marketplaceKind: DEFAULT_MARKETPLACE_TYPE,
	orderbookKind: undefined as OrderbookKind | undefined,
	paginationMode: DEFAULT_PAGINATION_MODE,
	sdkConfig: {
		projectId: DEFAULT_PROJECT_ID,
		projectAccessKey: DEFAULT_PROJECT_ACCESS_KEY,
		_internal: {
			overrides: {
				marketplaceConfig: undefined as Partial<MarketplaceConfig> | undefined,
				api: undefined as ApiOverrides | undefined,
				collections: [] as CollectionOverride[],
			},
		},
	} satisfies ExtendedSdkConfig,
};

//TODO: This really really should be validated
const savedSnapshot =
	typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

//ChainId was stored as string at some point, so we need to parse it
const savedSnapshotParsed = savedSnapshot ? JSON.parse(savedSnapshot) : null;
if (savedSnapshotParsed?.chainId) {
	savedSnapshotParsed.chainId = Number(savedSnapshotParsed.chainId);
}
const initialSnapshot: typeof defaultContext = savedSnapshotParsed
	? savedSnapshotParsed
	: structuredClone(defaultContext);

export const marketplaceStore = createStore({
	context: initialSnapshot,
	on: {
		setActiveTab: (context, { tab }: { tab: Tab }) => ({
			...context,
			activeTab: tab,
		}),

		setCollectionAddress: (
			context,
			{ address }: { address: `0x${string}` },
		) => ({
			...context,
			collectionAddress: address,
		}),

		setChainId: (context, { chainId }: { chainId: number }) => ({
			...context,
			chainId,
		}),

		setCollectibleId: (
			context,
			{ collectibleId }: { collectibleId: string },
		) => ({
			...context,
			collectibleId,
		}),

		setProjectId: (context, { id }: { id: string }) => ({
			...context,
			projectId: id,
			sdkConfig: {
				...context.sdkConfig,
				projectId: id,
			},
		}),

		setOrderbookKind: (
			context,
			{ kind }: { kind: OrderbookKind | undefined },
		) => ({
			...context,
			orderbookKind: kind,
		}),

		setPaginationMode: (context, { mode }: { mode: PaginationMode }) => ({
			...context,
			paginationMode: mode,
		}),

		resetSettings: () => structuredClone(defaultContext),

		setMarketplaceKind: (context, { kind }: { kind: MarketplaceType }) => ({
			...context,
			marketplaceKind: kind,
		}),

		setApiOverride: (
			context,
			{
				service,
				config,
			}: {
				service: keyof ApiOverrides;
				config: ApiConfig | undefined;
			},
		) => {
			const newSdkConfig = {
				...context.sdkConfig,
				_internal: {
					...context.sdkConfig._internal,
					overrides: {
						...context.sdkConfig._internal?.overrides,
						api: {
							...context.sdkConfig._internal?.overrides?.api,
							[service]: config,
						},
					},
				},
			} satisfies ExtendedSdkConfig;

			return {
				...context,
				sdkConfig: newSdkConfig,
			};
		},

		setMarketplaceConfigOverride: (
			context,
			{ config }: { config: Partial<MarketplaceConfig> | undefined },
		) => {
			const newSdkConfig = {
				...context.sdkConfig,
				_internal: {
					...context.sdkConfig._internal,
					overrides: {
						...context.sdkConfig._internal?.overrides,
						marketplaceConfig: config,
					},
				},
			} satisfies ExtendedSdkConfig;

			return {
				...context,
				sdkConfig: newSdkConfig,
			};
		},

		addCollectionOverride: (
			context,
			{ collection }: { collection: CollectionOverride },
		) => {
			const newSdkConfig = {
				...context.sdkConfig,
				_internal: {
					...context.sdkConfig._internal,
					overrides: {
						...context.sdkConfig._internal?.overrides,
						collections: [
							...(context.sdkConfig._internal?.overrides?.collections || []),
							collection,
						],
					},
				},
			} satisfies ExtendedSdkConfig;

			return {
				...context,
				sdkConfig: newSdkConfig,
			};
		},

		removeCollectionOverride: (context, { index }: { index: number }) => {
			const collections =
				context.sdkConfig._internal?.overrides?.collections || [];
			const newCollections = collections.filter((_, i) => i !== index);

			const newSdkConfig = {
				...context.sdkConfig,
				_internal: {
					...context.sdkConfig._internal,
					overrides: {
						...context.sdkConfig._internal?.overrides,
						collections: newCollections,
					},
				},
			} satisfies ExtendedSdkConfig;

			return {
				...context,
				sdkConfig: newSdkConfig,
			};
		},

		updateCollectionOverride: (
			context,
			{ index, collection }: { index: number; collection: CollectionOverride },
		) => {
			const collections =
				context.sdkConfig._internal?.overrides?.collections || [];
			const newCollections = [...collections];
			newCollections[index] = collection;

			const newSdkConfig = {
				...context.sdkConfig,
				_internal: {
					...context.sdkConfig._internal,
					overrides: {
						...context.sdkConfig._internal?.overrides,
						collections: newCollections,
					},
				},
			} satisfies ExtendedSdkConfig;

			return {
				...context,
				sdkConfig: newSdkConfig,
			};
		},

		setWalletOverride: (context) => {
			const newSdkConfig = {
				...context.sdkConfig,
				_internal: {
					...context.sdkConfig._internal,
					overrides: {
						...context.sdkConfig._internal?.overrides,
					},
				},
			} satisfies ExtendedSdkConfig;

			return {
				...context,
				sdkConfig: newSdkConfig,
			};
		},

		clearAllOverrides: (context) => {
			const newSdkConfig = {
				...context.sdkConfig,
				_internal: {
					overrides: {
						marketplaceConfig: undefined,
						api: undefined,
						collections: [],
					},
				},
			} satisfies ExtendedSdkConfig;

			return {
				...context,
				sdkConfig: newSdkConfig,
			};
		},
	},
});

marketplaceStore.subscribe((state) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state.context));
});
