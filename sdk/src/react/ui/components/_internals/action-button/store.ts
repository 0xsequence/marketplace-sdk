import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { CollectibleCardAction } from '../../../../../types';

type PendingAction = {
	type: CollectibleCardAction.BUY | CollectibleCardAction.OFFER;
	collectibleId: string;
	callback: () => void;
	timestamp: number;
};

export const actionButtonStore = createStore({
	context: {
		pendingAction: null as PendingAction | null,
	},
	on: {
		setPendingAction: (
			context,
			event: {
				action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER;
				onPendingActionExecuted: () => void;
				tokenId: string;
			},
		) => ({
			...context,
			pendingAction: {
				type: event.action,
				callback: event.onPendingActionExecuted,
				timestamp: Date.now(),
				collectibleId: event.tokenId,
			},
		}),
		clearPendingAction: (context) => ({
			...context,
			pendingAction: null,
		}),
	},
});

export const setPendingAction = (
	action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
	onPendingActionExecuted: () => void,
	tokenId: string,
) => {
	actionButtonStore.send({
		type: 'setPendingAction',
		action,
		onPendingActionExecuted,
		tokenId,
	});
};

// Selector hooks
export const usePendingAction = () =>
	useSelector(actionButtonStore, (state) => state.context.pendingAction);

export const clearPendingAction = () => {
	actionButtonStore.send({ type: 'clearPendingAction' });
};

export const executePendingActionIfExists = () => {
	const state = actionButtonStore.getSnapshot();
	const timestamp = state.context.pendingAction?.timestamp;
	const callback = state.context.pendingAction?.callback;

	if (timestamp && callback) {
		// Only execute if the pending action is less than 5 minutes old
		if (
			Date.now() - timestamp < 5 * 60 * 1000 &&
			typeof callback === 'function'
		) {
			callback();
		}
	}
};
