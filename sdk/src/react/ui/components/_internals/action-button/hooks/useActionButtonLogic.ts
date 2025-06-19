'use client';

import { useEffect } from 'react';
import { CollectibleCardAction } from '../../../../../../types';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import {
	clearPendingAction,
	executePendingAction,
	usePendingAction,
} from '../store';

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
	const pendingAction = usePendingAction();
	const pendingActionType = pendingAction?.type;

	// Handle owner restrictions
	// biome-ignore lint/correctness/useExhaustiveDependencies: clearPendingAction is stable from store
	useEffect(() => {
		if (
			owned &&
			pendingAction &&
			address &&
			actionsThatOwnersCannotPerform.includes(action) &&
			pendingAction?.collectibleId === tokenId
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
		pendingAction,
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
			pendingAction &&
			pendingAction?.collectibleId === tokenId
		) {
			executePendingAction(pendingAction);
			clearPendingAction();
		}
	}, [address, owned, tokenId, pendingAction]);

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
