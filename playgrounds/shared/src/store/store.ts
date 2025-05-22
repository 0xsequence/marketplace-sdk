import { createStore } from '@xstate/store';
import type { Hex } from 'viem';
import type { OrderbookKind, SdkConfig } from '../../../../sdk/src';
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
import type {
	MarketplaceType,
	PaginationMode,
	Tab,
	WalletType,
} from '../types';

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
		tmpShopConfig: {
			title: '',
			bannerUrl: '',
			collections: [
				{
					address: '0x46a1d82dc33f4e598e38ec0e409a94100f0f806d',
					chainId: 137,
					tokenIds: ['14', '17'],
					bannerUrl: '',
					primarySalesContractAddress:
						'0xbb29bd445f564b0e9eb5539d1366d7a5f1105b9f',
				},
				{
					address: '0x6838956422070bd85aa0c422b0ae33e4fde0f5dc',
					chainId: 80002,
					tokenIds: ['0', '1', '2'],
					bannerUrl: '',
					primarySalesContractAddress:
						'0x078839fabe130418ea6bc4c0f915ff6800994888',
				},
			],
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
	},
});

marketplaceStore.subscribe((state) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state.context));
});
