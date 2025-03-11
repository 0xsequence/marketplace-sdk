import type { OrderbookKind } from '@0xsequence/marketplace-sdk';
import { useSelector } from '@xstate/store/react';
import type { Hex } from 'viem';

import { marketplaceStore } from './store';
import type { PaginationMode, Tab } from './store';

export function useMarketplace() {
	const collectionAddress = useSelector(
		marketplaceStore,
		(state) => state.context.collectionAddress,
	);
	const chainId = useSelector(
		marketplaceStore,
		(state) => state.context.chainId,
	);
	const pendingChainId = useSelector(
		marketplaceStore,
		(state) => state.context.pendingChainId,
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
	const isEmbeddedWalletEnabled = useSelector(
		marketplaceStore,
		(state) => state.context.isEmbeddedWalletEnabled,
	);
	const orderbookKind = useSelector(
		marketplaceStore,
		(state) => state.context.orderbookKind,
	);
	const paginationMode = useSelector(
		marketplaceStore,
		(state) => state.context.paginationMode,
	);

	const { trigger } = marketplaceStore;

	return {
		collectionAddress,
		setCollectionAddress: (address: Hex) =>
			trigger.setCollectionAddress({ address }),
		chainId,
		pendingChainId,
		setChainId: (id: string) => trigger.setChainId({ id }),
		collectibleId,
		setCollectibleId: (id: string) => trigger.setCollectibleId({ id }),
		activeTab,
		setActiveTab: (tab: Tab) => trigger.setActiveTab({ tab }),
		setProjectId: (id: string) => trigger.setProjectId({ id }),
		sdkConfig,
		isEmbeddedWalletEnabled,
		setIsEmbeddedWalletEnabled: (enabled: boolean) =>
			trigger.setIsEmbeddedWalletEnabled({ enabled }),
		orderbookKind,
		setOrderbookKind: (kind: OrderbookKind | undefined) =>
			trigger.setOrderbookKind({ kind }),
		paginationMode,
		setPaginationMode: (mode: PaginationMode) =>
			trigger.setPaginationMode({ mode }),
	};
}
