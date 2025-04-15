'use client';

import { useEffect } from 'react';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import {
	actionButtonStore,
	clearPendingAction,
	executePendingActionIfExists,
} from '../store';
import { CollectibleCardAction } from '../types';

type UseActionButtonLogicProps = {
	tokenId: string;
	owned?: boolean;
	action: CollectibleCardAction;
	onCannotPerformAction?: (
		action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
	) => void;
};

export const useActionButtonLogic = ({
	tokenId,
	owned,
	action,
	onCannotPerformAction,
}: UseActionButtonLogicProps) => {
	const { wallet } = useWallet();
	const address = wallet?.address;
	const actionsThatOwnersCannotPerform = [
		CollectibleCardAction.BUY,
		CollectibleCardAction.OFFER,
	];
	const pendingActionType = actionButtonStore.pendingAction.type.get();

	// Handle owner restrictions
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (
			owned &&
			actionButtonStore.pendingAction.get() &&
			address &&
			actionsThatOwnersCannotPerform.includes(action) &&
			actionButtonStore.pendingAction.get()?.collectibleId === tokenId
		) {
			onCannotPerformAction?.(
				pendingActionType as
					| CollectibleCardAction.BUY
					| CollectibleCardAction.OFFER,
			);
			clearPendingAction();
		}
	}, [
		owned,
		actionButtonStore.pendingAction.get(),
		address,
		action,
		tokenId,
		onCannotPerformAction,
		pendingActionType,
	]);

	// Execute pending action when user becomes connected
	useEffect(() => {
		if (
			address &&
			!owned &&
			actionButtonStore.pendingAction.get() &&
			actionButtonStore.pendingAction.get()?.collectibleId === tokenId
		) {
			// TODO: Remove this timeout once pointer-events: none issue is fixed on Radix UI side
			setTimeout(() => {
				executePendingActionIfExists();
				clearPendingAction();
			}, 1000);
		}
	}, [address, owned, tokenId]);

	const shouldShowAction = !address
		? [CollectibleCardAction.BUY, CollectibleCardAction.OFFER].includes(action)
		: true;

	const isOwnerAction =
		address &&
		owned &&
		[
			CollectibleCardAction.LIST,
			CollectibleCardAction.TRANSFER,
			CollectibleCardAction.SELL,
		].includes(action);

	return {
		address,
		shouldShowAction,
		isOwnerAction,
	};
};
