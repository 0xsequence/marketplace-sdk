'use client';

import { observer } from '@legendapp/state/react';
import type { JSX } from 'react/jsx-runtime';
import type { Hex } from 'viem';
import type { Order, OrderbookKind } from '../../../../_internal';
import { NonOwnerActions } from './components/NonOwnerActions';
import { OwnerActions } from './components/OwnerActions';
import { useActionButtonLogic } from './hooks/useActionButtonLogic';
import type { CollectibleCardAction } from './types';

type ActionButtonProps = {
	chainId: string;
	collectionAddress: Hex;
	tokenId: string;
	orderbookKind?: OrderbookKind;
	isTransfer?: boolean;
	action: CollectibleCardAction;
	owned?: boolean;
	highestOffer?: Order;
	lowestListing?: Order;
	onCannotPerformAction?: (
		action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
	) => void;
};

export const ActionButton: ({
	collectionAddress,
	chainId,
	tokenId,
	orderbookKind,
	action,
	owned,
	highestOffer,
	lowestListing,
	onCannotPerformAction,
}: ActionButtonProps) => JSX.Element | null = observer(
	({
		collectionAddress,
		chainId,
		tokenId,
		orderbookKind,
		action,
		owned,
		highestOffer,
		lowestListing,
		onCannotPerformAction,
	}: ActionButtonProps): JSX.Element | null => {
		const { shouldShowAction, isOwnerAction } = useActionButtonLogic({
			tokenId,
			owned,
			action,
			onCannotPerformAction,
		});

		if (!shouldShowAction) {
			return null;
		}

		if (isOwnerAction) {
			return (
				<OwnerActions
					action={action}
					tokenId={tokenId}
					collectionAddress={collectionAddress}
					chainId={chainId}
					orderbookKind={orderbookKind}
					highestOffer={highestOffer}
				/>
			);
		}

		return (
			<NonOwnerActions
				action={action}
				tokenId={tokenId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				orderbookKind={orderbookKind}
				lowestListing={lowestListing}
			/>
		);
	},
);
