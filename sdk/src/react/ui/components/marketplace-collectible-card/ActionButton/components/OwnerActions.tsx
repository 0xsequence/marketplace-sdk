'use client';

import type { Address } from '@0xsequence/api-client';
import { CollectibleCardAction } from '../../../../../../types';
import type { Order } from '../../../../../_internal';
import { useCreateListingModal } from '../../../../modals/CreateListingModal';
import { useSellModal } from '../../../../modals/SellModal';
import { useTransferModal } from '../../../../modals/TransferModal';
import { ActionButtonBody } from './ActionButtonBody';

type OwnerActionsProps = {
	action: CollectibleCardAction;
	tokenId: bigint;
	collectionAddress: Address;
	chainId: number;
	highestOffer?: Order;
	labelOverride?: {
		listing?: string;
		sell?: string;
		transfer?: string;
	};
	className?: string;
};

export function OwnerActions({
	action,
	tokenId,
	collectionAddress,
	chainId,
	highestOffer,
	labelOverride,
	className,
}: OwnerActionsProps) {
	const { show: showCreateListingModal } = useCreateListingModal();
	const { show: showSellModal } = useSellModal();
	const { show: showTransferModal } = useTransferModal();

	if (action === CollectibleCardAction.LIST) {
		return (
			<ActionButtonBody
				label={labelOverride?.listing ?? 'Create listing'}
				tokenId={tokenId}
				onClick={() =>
					showCreateListingModal({
						collectionAddress,
						chainId,
						tokenId,
					})
				}
				className={className}
			/>
		);
	}

	if (action === CollectibleCardAction.SELL && highestOffer) {
		return (
			<ActionButtonBody
				tokenId={tokenId}
				label={labelOverride?.sell ?? 'Sell'}
				onClick={() =>
					showSellModal({
						collectionAddress,
						chainId,
						tokenId,
						order: highestOffer,
					})
				}
				className={className}
			/>
		);
	}

	if (action === CollectibleCardAction.TRANSFER) {
		return (
			<ActionButtonBody
				label={labelOverride?.transfer ?? 'Transfer'}
				tokenId={tokenId}
				onClick={() =>
					showTransferModal({
						collectionAddress,
						chainId,
						tokenId,
					})
				}
				className={className}
			/>
		);
	}

	return null;
}
