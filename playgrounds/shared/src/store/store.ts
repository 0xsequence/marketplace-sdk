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
	WAAS_CONFIG_KEY,
} from '../consts';
import type { Tab } from '../types';
import { isNotUndefined, isValidHexAddress } from './utils';

const defaultContext = {
	collectionAddress: DEFAULT_COLLECTION_ADDRESS,
	pendingCollectionAddress: DEFAULT_COLLECTION_ADDRESS,
	chainId: DEFAULT_CHAIN_ID,
	pendingChainId: DEFAULT_CHAIN_ID,
	collectibleId: DEFAULT_COLLECTIBLE_ID,
	pendingCollectibleId: DEFAULT_COLLECTIBLE_ID,
	activeTab: (window.location.pathname.slice(1) || DEFAULT_ACTIVE_TAB) as Tab,
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

const savedSnapshot = localStorage.getItem('store');
const initialSnapshot: typeof defaultContext = savedSnapshot
	? JSON.parse(savedSnapshot)
	: defaultContext;

export const marketplaceStore = createStore({
	context: initialSnapshot,
	on: {
		setCollectionAddress: (context, { address }: { address: Hex }) => {
			const isValid = isValidHexAddress(address);
			return {
				...context,
				pendingCollectionAddress: address,
				collectionAddress: isValid ? address : context.collectionAddress,
				isCollectionAddressValid: isValid,
			};
		},

		// Chain ID events
		setChainId: (context, { id }: { id: string }) => {
			const isValid = isNotUndefined(id);
			return {
				...context,
				pendingChainId: id,
				chainId: isValid ? id : context.chainId,
				isChainIdValid: isValid,
			};
		},

		setCollectibleId: (context, { id }: { id: string }) => {
			const isValid = isNotUndefined(id);
			return {
				...context,
				pendingCollectibleId: id,
				collectibleId: isValid ? id : context.collectibleId,
				isCollectibleIdValid: isValid,
			};
		},

		setActiveTab: (context, { tab }: { tab: Tab }) => ({
			...context,
			activeTab: tab,
		}),

		setProjectId: (context, { id }: { id: string }) => {
			const newSdkConfig = {
				...context.sdkConfig,
				projectId: id,
			};

			return {
				...context,
				projectId: id,
				sdkConfig: newSdkConfig,
			};
		},

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
	},
});
