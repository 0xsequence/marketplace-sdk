import { createStore } from '@xstate/store';
import type { CollectibleCardAction } from '../../../../../types';

type PendingAction = {
	type: CollectibleCardAction.BUY | CollectibleCardAction.OFFER;
	collectibleId: string;
	callback: () => void;
	timestamp: number;
};

type ActionButtonStore = {
	pendingAction: PendingAction | null;
};

export const actionButtonStore = createStore<ActionButtonStore>(
	{
		pendingAction: null,
	},
	{
		setPendingAction: (
			context,
			event: {
				type: CollectibleCardAction.BUY | CollectibleCardAction.OFFER;
				callback: () => void;
				collectibleId: string;
			},
		) => ({
			...context,
			pendingAction: {
				type: event.type,
				callback: event.callback,
				timestamp: Date.now(),
				collectibleId: event.collectibleId,
			},
		}),
		clearPendingAction: (context) => ({
			...context,
			pendingAction: null,
		}),
	},
);

export const setPendingAction = (
	type: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
	callback: () => void,
	collectibleId: string,
) => {
	actionButtonStore.send({
		type: 'setPendingAction',
		type: type,
		callback,
		collectibleId,
	});
};

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
