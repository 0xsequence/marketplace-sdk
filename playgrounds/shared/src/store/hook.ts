import type {
	ApiConfig,
	CardType,
	OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import { useSelector } from '@xstate/store/react';

import type { PaginationMode, Tab } from '../types';
import {
	type ApiOverrides,
	type CollectionOverride,
	marketplaceStore,
} from './store';

// Add type for trigger events
type TriggerEvents = {
	setActiveTab: { tab: Tab };
	setProjectId: { id: string };
	setOrderbookKind: { kind: OrderbookKind | undefined };
	setPaginationMode: { mode: PaginationMode };
	setMarketplaceKind: { kind: CardType };
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
	const activeTab = useSelector(
		marketplaceStore,
		(state) => state.context.activeTab,
	);
	const sdkConfig = useSelector(
		marketplaceStore,
		(state) => state.context.sdkConfig,
	);
	const orderbookKind = useSelector(
		marketplaceStore,
		(state) => state.context.orderbookKind,
	);
	const paginationMode = useSelector(
		marketplaceStore,
		(state) => state.context.paginationMode,
	);

	const cardType = useSelector(
		marketplaceStore,
		(state) => state.context.marketplaceKind,
	);

	const { trigger } = marketplaceStore as {
		trigger: { [K in keyof TriggerEvents]: (event: TriggerEvents[K]) => void };
	};

	return {
		activeTab,
		setActiveTab: (tab: Tab) => trigger.setActiveTab({ tab }),
		setProjectId: (id: string) => trigger.setProjectId({ id }),
		sdkConfig,
		orderbookKind,
		setOrderbookKind: (kind: OrderbookKind | undefined) =>
			trigger.setOrderbookKind({ kind }),
		paginationMode,
		setPaginationMode: (mode: PaginationMode) =>
			trigger.setPaginationMode({ mode }),
		cardType,
		setCardType: (kind: CardType) => trigger.setMarketplaceKind({ kind }),
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
