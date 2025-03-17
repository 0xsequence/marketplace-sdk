import { Observable, observable } from '@legendapp/state';
import type { CollectibleCardAction } from './types';

type PendingAction = {
	type: CollectibleCardAction.BUY | CollectibleCardAction.OFFER;
	collectibleId: string;
	callback: () => void;
	timestamp: number;
};

export const actionButtonStore: Observable<{
    pendingAction: PendingAction | null;
}> = observable({
	pendingAction: null as PendingAction | null,
});

export const setPendingAction = (
	type: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
	callback: () => void,
	collectibleId: string,
): void => {
	actionButtonStore.pendingAction.set({
		type,
		callback,
		timestamp: Date.now(),
		collectibleId,
	});
};

export const clearPendingAction = (): void => {
	actionButtonStore.pendingAction.set(null);
};

export const executePendingActionIfExists = (): void => {
	const timestamp = actionButtonStore.pendingAction.get()?.timestamp;
	const callback = actionButtonStore.pendingAction.get()?.callback as
		| (() => void)
		| undefined;

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
