import { createStore } from '@xstate/store';
import type { Hex } from 'viem';
import type { OrderbookKind } from '../../../../packages/sdk/src';
import {
	DEFAULT_ACTIVE_TAB,
	DEFAULT_CHAIN_ID,
	DEFAULT_COLLECTIBLE_ID,
	DEFAULT_COLLECTION_ADDRESS,
	DEFAULT_EMBEDDED_WALLET_ENABLED,
	DEFAULT_PAGINATION_MODE,
	DEFAULT_PROJECT_ACCESS_KEY,
	DEFAULT_PROJECT_ID,
	STORAGE_KEY,
	WAAS_CONFIG_KEY,
} from '../consts';
import type { PaginationMode, Tab } from '../types';

const defaultContext = {
	collectionAddress: DEFAULT_COLLECTION_ADDRESS,
	chainId: DEFAULT_CHAIN_ID,
	collectibleId: DEFAULT_COLLECTIBLE_ID,
	activeTab:
		typeof window !== 'undefined'
			? ((window.location.pathname.slice(1) || DEFAULT_ACTIVE_TAB) as Tab)
			: DEFAULT_ACTIVE_TAB,
	projectId: DEFAULT_PROJECT_ID,
	isEmbeddedWalletEnabled: DEFAULT_EMBEDDED_WALLET_ENABLED,
	orderbookKind: undefined as OrderbookKind | undefined,
	paginationMode: DEFAULT_PAGINATION_MODE,
	sdkConfig: {
		projectId: DEFAULT_PROJECT_ID,
		projectAccessKey: DEFAULT_PROJECT_ACCESS_KEY,
		wallet: DEFAULT_EMBEDDED_WALLET_ENABLED
			? {
					embedded: {
						waasConfigKey: WAAS_CONFIG_KEY,
					},
				}
			: undefined,
	},
};

//TODO: This really really should be validated
const savedSnapshot =
	typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const initialSnapshot: typeof defaultContext = savedSnapshot
	? JSON.parse(savedSnapshot)
	: structuredClone(defaultContext);

export const marketplaceStore = createStore({
	context: initialSnapshot,
	on: {
		setActiveTab: (context, { tab }: { tab: Tab }) => ({
			...context,
			activeTab: tab,
		}),

		setProjectId: (context, { id }: { id: string }) => ({
			...context,
			projectId: id,
		}),

		setIsEmbeddedWalletEnabled: (
			context,
			{ enabled }: { enabled: boolean },
		) => {
			const wallet = enabled
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
				isEmbeddedWalletEnabled: enabled,
				sdkConfig: newSdkConfig,
			};
		},

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

		setChainId: (context, { id }: { id: string }) => ({
			...context,
			chainId: id,
		}),

		setCollectibleId: (context, { id }: { id: string }) => ({
			...context,
			collectibleId: id,
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
				chainId: string;
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
