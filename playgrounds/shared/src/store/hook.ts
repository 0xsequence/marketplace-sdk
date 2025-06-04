import type { ApiConfig, OrderbookKind } from '@0xsequence/marketplace-sdk';
import { useSelector } from '@xstate/store/react';
import type { Hex } from 'viem';
import type { MarketplaceType } from '../../../../sdk/src/types/types';

import type { PaginationMode, Tab } from '../types';
import {
	type ApiOverrides,
	type CollectionOverride,
	marketplaceStore,
} from './store';

// Add type for trigger events
type TriggerEvents = {
	setCollectionAddress: { address: Hex };
	setActiveTab: { tab: Tab };
	setProjectId: { id: string };
	setChainId: { chainId: number };
	setCollectibleId: { collectibleId: string };
	setOrderbookKind: { kind: OrderbookKind | undefined };
	setPaginationMode: { mode: PaginationMode };
	setMarketplaceKind: { kind: MarketplaceType };
	resetSettings: undefined;
	setApiOverride: {
		service: keyof ApiOverrides;
		config: ApiConfig | undefined;
	};
	addCollectionOverride: { collection: CollectionOverride };
	removeCollectionOverride: { index: number };
	updateCollectionOverride: { index: number; collection: CollectionOverride };
	clearAllOverrides: undefined;
};

export function useMarketplace() {
	const collectionAddress = useSelector(
		marketplaceStore,
		(state) => state.context.collectionAddress,
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

	const chainId = useSelector(
		marketplaceStore,
		(state) => state.context.chainId,
	);

	const collectibleId = useSelector(
		marketplaceStore,
		(state) => state.context.collectibleId,
	);

	const { trigger } = marketplaceStore as {
		trigger: { [K in keyof TriggerEvents]: (event: TriggerEvents[K]) => void };
	};

	return {
		collectionAddress,
		setCollectionAddress: (address: Hex) =>
			trigger.setCollectionAddress({ address }),
		activeTab,
		setActiveTab: (tab: Tab) => trigger.setActiveTab({ tab }),
		setProjectId: (id: string) => trigger.setProjectId({ id }),
		chainId,
		setChainId: (chainId: number) => trigger.setChainId({ chainId }),
		collectibleId,
		setCollectibleId: (collectibleId: string) =>
			trigger.setCollectibleId({ collectibleId }),
		sdkConfig,
		walletType,
		orderbookKind,
		setOrderbookKind: (kind: OrderbookKind | undefined) =>
			trigger.setOrderbookKind({ kind }),
		paginationMode,
		setPaginationMode: (mode: PaginationMode) =>
			trigger.setPaginationMode({ mode }),
		marketplaceType,
		setMarketplaceType: (kind: MarketplaceType) =>
			trigger.setMarketplaceKind({ kind }),
		resetSettings: () => trigger.resetSettings(undefined),
		setApiOverride: (
			service: keyof ApiOverrides,
			config: ApiConfig | undefined,
		) => trigger.setApiOverride({ service, config }),
		addCollectionOverride: (collection: CollectionOverride) =>
			trigger.addCollectionOverride({ collection }),
		removeCollectionOverride: (index: number) =>
			trigger.removeCollectionOverride({ index }),
		updateCollectionOverride: (index: number, collection: CollectionOverride) =>
			trigger.updateCollectionOverride({ index, collection }),
		clearAllOverrides: () => trigger.clearAllOverrides(undefined),
	};
}
