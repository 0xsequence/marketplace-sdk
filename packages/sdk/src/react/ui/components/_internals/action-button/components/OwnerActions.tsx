import type { Hex } from 'viem';
import type { Order, OrderbookKind } from '../../../../../_internal';
import { CollectibleCardAction } from '../types';
import { ActionButtonBody } from './ActionButtonBody';
import { useCreateListingModal } from '../../../../modals/CreateListingModal';
import { useSellModal } from '../../../../modals/SellModal';
import { useTransferModal } from '../../../../modals/TransferModal';

type OwnerActionsProps = {
	action: CollectibleCardAction;
	tokenId: string;
	collectionAddress: Hex;
	chainId: string;
	orderbookKind?: OrderbookKind;
	highestOffer?: Order;
};

export function OwnerActions({
	action,
	tokenId,
	collectionAddress,
	chainId,
	orderbookKind,
	highestOffer,
}: OwnerActionsProps) {
	const { show: showCreateListingModal } = useCreateListingModal();
	const { show: showSellModal } = useSellModal();
	const { show: showTransferModal } = useTransferModal();

	if (action === CollectibleCardAction.LIST) {
		return (
			<ActionButtonBody
				label="Create listing"
				tokenId={tokenId}
				onClick={() =>
					showCreateListingModal({
						collectionAddress: collectionAddress as Hex,
						chainId,
						collectibleId: tokenId,
						orderbookKind,
					})
				}
			/>
		);
	}

	if (action === CollectibleCardAction.SELL && highestOffer) {
		return (
			<ActionButtonBody
				tokenId={tokenId}
				label="Sell"
				onClick={() =>
					showSellModal({
						collectionAddress,
						chainId,
						tokenId,
						order: highestOffer,
					})
				}
			/>
		);
	}

	if (action === CollectibleCardAction.TRANSFER) {
		return (
			<ActionButtonBody
				label="Transfer"
				tokenId={tokenId}
				onClick={() =>
					showTransferModal({
						collectionAddress: collectionAddress as Hex,
						chainId,
						collectibleId: tokenId,
					})
				}
			/>
		);
	}

	return null;
}
