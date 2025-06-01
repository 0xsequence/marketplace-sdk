import { createStore } from '@xstate/store';
import type { Hex } from 'viem';
import type {
	ApiConfig,
	CollectionOverride,
	MarketplaceConfig,
	MarketplaceType,
	OrderbookKind,
	SdkConfig,
	WalletOverride,
} from '../../../../sdk/src';
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
	WAAS_CONFIG_KEY,
} from '../consts';
import type { PaginationMode, Tab, WalletType } from '../types';

export type ApiOverrides = {
	builder?: ApiConfig;
	marketplace?: ApiConfig;
	nodeGateway?: ApiConfig;
	metadata?: ApiConfig;
	indexer?: ApiConfig;
	sequenceApi?: ApiConfig;
	sequenceWallet?: ApiConfig;
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
				api: {} as ApiOverrides,
				collection: undefined as CollectionOverride | undefined,
				wallet: undefined as WalletOverride | undefined,
			},
		},
	} satisfies SdkConfig,
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
		setWalletType: (context, { walletType }: { walletType: WalletType }) => {
			const wallet =
				walletType !== 'universal'
					? {
							embedded: {
								waasConfigKey: WAAS_CONFIG_KEY,
							},
						}
					: undefined;

			const newSdkConfig = {
				...context.sdkConfig,
				wallet,
			};

			return {
				...context,
				walletType,
				sdkConfig: newSdkConfig,
			};
		},

		setActiveTab: (context, { tab }: { tab: Tab }) => ({
			...context,
			activeTab: tab,
		}),

		setProjectId: (context, { id }: { id: string }) => ({
			...context,
			projectId: id,
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

		setCollectionAddress: (context, { address }: { address: Hex }) => ({
			...context,
			collectionAddress: address,
		}),

		setChainId: (context, { id }: { id: number }) => ({
			...context,
			chainId: id,
		}),

		setCollectibleId: (context, { id }: { id: string }) => ({
			...context,
			collectibleId: id,
		}),

		setMarketplaceKind: (context, { kind }: { kind: MarketplaceType }) => ({
			...context,
			marketplaceKind: kind,
		}),

		applySettings: (
			context,
			{
				projectId,
				collectionAddress,
				chainId,
				collectibleId,
			}: {
				projectId: string;
				collectionAddress: Hex;
				chainId: number;
				collectibleId: string;
			},
		) => {
			return {
				...context,
				projectId,
				collectionAddress,
				chainId,
				collectibleId,
			};
		},

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
			} satisfies SdkConfig;

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
			} satisfies SdkConfig;

			return {
				...context,
				sdkConfig: newSdkConfig,
			};
		},

		setCollectionOverride: (
			context,
			{ config }: { config: CollectionOverride | undefined },
		) => {
			const newSdkConfig = {
				...context.sdkConfig,
				_internal: {
					...context.sdkConfig._internal,
					overrides: {
						...context.sdkConfig._internal?.overrides,
						collection: config,
					},
				},
			} satisfies SdkConfig;

			return {
				...context,
				sdkConfig: newSdkConfig,
			};
		},

		setWalletOverride: (
			context,
			{ config }: { config: WalletOverride | undefined },
		) => {
			const newSdkConfig = {
				...context.sdkConfig,
				_internal: {
					...context.sdkConfig._internal,
					overrides: {
						...context.sdkConfig._internal?.overrides,
						wallet: config,
					},
				},
			} satisfies SdkConfig;

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
						api: {},
						collection: undefined,
						wallet: undefined,
					},
				},
			} satisfies SdkConfig;

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
