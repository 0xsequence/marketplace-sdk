'use client';

import { Button } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { InvalidStepError } from '../../../../../utils/_internal/error/transaction';
import type { Order, OrderbookKind } from '../../../../_internal';
import { useBuyModal } from '../../../modals/BuyModal';
import { useCreateListingModal } from '../../../modals/CreateListingModal';
import { useMakeOfferModal } from '../../../modals/MakeOfferModal';
import { useSellModal } from '../../../modals/SellModal';
import { useTransferModal } from '../../../modals/TransferModal';

import { CollectibleCardAction } from './types';

type ActionButtonProps = {
	chainId: string;
	collectionAddress: Hex;
	tokenId: string;
	orderbookKind: OrderbookKind;
	isTransfer?: boolean;
	action: CollectibleCardAction;
	isOwned: boolean;
	highestOffer?: Order;
	lowestListing?: Order;
};

export const ActionButton = observer(
	({
		collectionAddress,
		chainId,
		tokenId,
		orderbookKind,
		action,
		highestOffer,
		lowestListing,
	}: ActionButtonProps) => {
		const { show: showCreateListingModal } = useCreateListingModal();
		const { show: showMakeOfferModal } = useMakeOfferModal();
		const { show: showSellModal } = useSellModal();
		const { show: showTransferModal } = useTransferModal();
		const { show: showBuyModal } = useBuyModal();

		if (action === CollectibleCardAction.BUY) {
			if (!lowestListing)
				throw new InvalidStepError('BUY', 'lowestListing is required');

			return (
				<ActionButtonBody
					label="Buy"
					onClick={() =>
						showBuyModal({
							collectionAddress,
							chainId: chainId,
							tokenId: tokenId,
							order: lowestListing,
						})
					}
				/>
			);
		}

		if (action === CollectibleCardAction.SELL) {
			if (!highestOffer)
				throw new InvalidStepError('SELL', 'highestOffer is required');

			return (
				<ActionButtonBody
					label="Sell"
					onClick={() =>
						showSellModal({
							collectionAddress,
							chainId: chainId,
							tokenId: tokenId,
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
							orderbookKind,
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
							orderbookKind,
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
							collectibleId: tokenId,
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
