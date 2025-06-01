import type {
	ApiConfig,
	CollectionOverride,
	MarketplaceConfig,
	MarketplaceType,
	OrderbookKind,
	WalletOverride,
} from '@0xsequence/marketplace-sdk';
import { useSelector } from '@xstate/store/react';
import type { Hex } from 'viem';

import type { PaginationMode, Tab, WalletType } from '../types';
import { type ApiOverrides, marketplaceStore } from './store';

export function useMarketplace() {
	const collectionAddress = useSelector(
		marketplaceStore,
		(state) => state.context.collectionAddress,
	);
	const chainId = useSelector(
		marketplaceStore,
		(state) => state.context.chainId,
	);

	const collectibleId = useSelector(
		marketplaceStore,
		(state) => state.context.collectibleId,
	);
	const activeTab = useSelector(
		marketplaceStore,
		(state) => state.context.activeTab,
	);
	const sdkConfig = useSelector(
		marketplaceStore,
		(state) => state.context.sdkConfig,
	);
	const walletType = useSelector(
		marketplaceStore,
		(state) => state.context.walletType,
	);
	const orderbookKind = useSelector(
		marketplaceStore,
		(state) => state.context.orderbookKind,
	);
	const paginationMode = useSelector(
		marketplaceStore,
		(state) => state.context.paginationMode,
	);

	const marketplaceType = useSelector(
		marketplaceStore,
		(state) => state.context.marketplaceKind,
	);

	const { trigger } = marketplaceStore;

	return {
		collectionAddress,
		setCollectionAddress: (address: Hex) =>
			trigger.setCollectionAddress({ address }),
		chainId,
		setChainId: (id: number) => trigger.setChainId({ id }),
		collectibleId,
		setCollectibleId: (id: string) => trigger.setCollectibleId({ id }),
		activeTab,
		setActiveTab: (tab: Tab) => trigger.setActiveTab({ tab }),
		setProjectId: (id: string) => trigger.setProjectId({ id }),
		sdkConfig,
		walletType,
		setWalletType: (walletType: WalletType) =>
			trigger.setWalletType({ walletType }),
		orderbookKind,
		setOrderbookKind: (kind: OrderbookKind | undefined) =>
			trigger.setOrderbookKind({ kind }),
		paginationMode,
		setPaginationMode: (mode: PaginationMode) =>
			trigger.setPaginationMode({ mode }),
		marketplaceType,
		setMarketplaceType: (kind: MarketplaceType) =>
			trigger.setMarketplaceKind({ kind }),
		resetSettings: () => trigger.resetSettings(),
		applySettings: (
			projectId: string,
			collectionAddress: Hex,
			chainId: number,
			collectibleId: string,
		) =>
			trigger.applySettings({
				projectId,
				collectionAddress,
				chainId,
				collectibleId,
			}),
		setApiOverride: (
			service: keyof ApiOverrides,
			config: ApiConfig | undefined,
		) => trigger.setApiOverride({ service, config }),
		setMarketplaceConfigOverride: (
			config: Partial<MarketplaceConfig> | undefined,
		) => trigger.setMarketplaceConfigOverride({ config }),
		setCollectionOverride: (config: CollectionOverride | undefined) =>
			trigger.setCollectionOverride({ config }),
		setWalletOverride: (config: WalletOverride | undefined) =>
			trigger.setWalletOverride({ config }),
		clearAllOverrides: () => trigger.clearAllOverrides(),
	};
}
