import type { ApiConfig, OrderbookKind } from '@0xsequence/marketplace-sdk';
import { useSelector } from '@xstate/store/react';

import type { PaginationMode, Tab } from '../types';
import {
	type ApiOverrides,
	type CheckoutModeOverride,
	type CollectionOverride,
	marketplaceStore,
} from './store';

type TriggerEvents = {
	setActiveTab: { tab: Tab };
	setProjectId: { id: string };
	setOrderbookKind: { kind: OrderbookKind | undefined };
	setPaginationMode: { mode: PaginationMode };
	setCheckoutModeOverride: { mode: CheckoutModeOverride };
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
	const checkoutModeOverride = useSelector(
		marketplaceStore,
		(state) => state.context.checkoutModeOverride,
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
		checkoutModeOverride,
		setCheckoutModeOverride: (mode: CheckoutModeOverride) =>
			trigger.setCheckoutModeOverride({ mode }),
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
