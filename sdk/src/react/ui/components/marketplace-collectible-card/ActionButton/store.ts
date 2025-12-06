'use client';

import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { CollectibleCardAction } from '../../../../../types';

type PendingAction = {
	type: CollectibleCardAction.BUY | CollectibleCardAction.OFFER;
	tokenId: bigint;
	callback: () => void;
	timestamp: number;
};

interface ActionButtonContext {
	pendingAction: PendingAction | null;
}

export const actionButtonStore = createStore({
	context: {
		pendingAction: null,
	} as ActionButtonContext,
	on: {
		setPendingAction: (
			context,
			event: {
				action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER;
				onPendingActionExecuted: () => void;
				tokenId: bigint;
			},
		) => ({
			...context,
			pendingAction: {
				type: event.action,
				callback: event.onPendingActionExecuted,
				timestamp: Date.now(),
				tokenId: event.tokenId,
			},
		}),
		clearPendingAction: (context) => ({
			...context,
			pendingAction: null,
		}),
	},
});

export const useActionButtonStore = () => {
	const pendingAction = useSelector(
		actionButtonStore,
		(state) => state.context.pendingAction,
	);

	return {
		pendingAction,
		setPendingAction: (
			action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
			onPendingActionExecuted: () => void,
			tokenId: bigint,
		) => {
			actionButtonStore.send({
				type: 'setPendingAction',
				action,
				onPendingActionExecuted,
				tokenId,
			});
		},
		clearPendingAction: () => {
			actionButtonStore.send({ type: 'clearPendingAction' });
		},
		executePendingAction: () => {
			if (!pendingAction) return;

			const { timestamp, callback } = pendingAction;

			if (timestamp && callback) {
				// Only execute if the pending action is less than 5 minutes old
				if (
					Date.now() - timestamp < 5 * 60 * 1000 &&
					typeof callback === 'function'
				) {
					callback();
				}
			}
		},
	};
};
