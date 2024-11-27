'use client';

import { Button } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { useCreateListingModal } from '../../../modals/CreateListingModal';
import { useMakeOfferModal } from '../../../modals/MakeOfferModal';
import { useSellModal } from '../../../modals/SellModal';
import { Order } from '../../../../_internal';
import { useTransferModal } from '../../../modals/TransferModal';

export enum CollectibleCardAction {
	BUY = 'Buy',
	SELL = 'Sell',
	LIST = 'Create listing',
	OFFER = 'Make an offer',
	TRANSFER = 'Transfer',
}

type ActionButtonProps = {
	chainId: string;
	collectionAddress: string;
	tokenId: string;
	isTransfer?: boolean;
	action: CollectibleCardAction;
	isOwned: boolean;
	highestOffer?: Order;
};

export const ActionButton = observer(
	({
		collectionAddress,
		chainId,
		tokenId,
		action,
		highestOffer,
	}: ActionButtonProps) => {
		const { show: showCreateListingModal } = useCreateListingModal();
		const { show: showMakeOfferModal } = useMakeOfferModal();
		const { show: showSellModal } = useSellModal();
		const { show: showTransferModal } = useTransferModal();

		if (action === CollectibleCardAction.BUY) {
			console.log('Buy action');
			return;
		}

		if (action === CollectibleCardAction.SELL) {
			if (!highestOffer)
				throw new Error('highestOffer is required for SELL action');

			return (
				<ActionButtonBody
					label="Sell"
					onClick={() =>
						showSellModal({
							collectionAddress: collectionAddress as Hex,
							chainId: chainId,
							tokenId: tokenId,
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							order: highestOffer,
						})
					}
				/>
			);
		}

		if (action === CollectibleCardAction.LIST) {
			return (
				<ActionButtonBody
					label="Create listing"
					onClick={() =>
						showCreateListingModal({
							collectionAddress: collectionAddress as Hex,
							chainId: chainId,
							collectibleId: tokenId,
						})
					}
				/>
			);
		}

		if (action === CollectibleCardAction.OFFER) {
			return (
				<ActionButtonBody
					label="Make an offer"
					onClick={() =>
						showMakeOfferModal({
							collectionAddress: collectionAddress as Hex,
							chainId: chainId,
							collectibleId: tokenId,
						})
					}
				/>
			);
		}

		if (action === CollectibleCardAction.TRANSFER) {
			return (
				<ActionButtonBody
					label="Transfer"
					onClick={() =>
						showTransferModal({
							collectionAddress: collectionAddress as Hex,
							chainId: chainId,
							tokenId,
						})
					}
				/>
			);
		}

		return null;
	},
);

type ActionButtonBodyProps = {
	label: string;
	onClick: () => void;
};

function ActionButtonBody({ label, onClick }: ActionButtonBodyProps) {
	return (
		<Button
			variant="primary"
			label={label}
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick();
			}}
			// leftIcon={leftIcon}
			size="xs"
			shape="square"
			width="full"
		/>
	);
}
