import type { Hex } from 'viem';
import { InvalidStepError } from '../../../../../../utils/_internal/error/transaction';
import type { Order, OrderbookKind } from '../../../../../_internal';
import SvgCartIcon from '../../../../icons/CartIcon';
import { useBuyModal } from '../../../../modals/BuyModal';
import { useMakeOfferModal } from '../../../../modals/MakeOfferModal';
import { CollectibleCardAction } from '../types';
import { ActionButtonBody } from './ActionButtonBody';

type NonOwnerActionsProps = {
	action: CollectibleCardAction;
	tokenId: string;
	collectionAddress: Hex;
	chainId: string;
	orderbookKind?: OrderbookKind;
	lowestListing?: Order;
};

export function NonOwnerActions({
	action,
	tokenId,
	collectionAddress,
	chainId,
	orderbookKind,
	lowestListing,
}: NonOwnerActionsProps) {
	const { show: showBuyModal } = useBuyModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();

	if (action === CollectibleCardAction.BUY) {
		if (!lowestListing) {
			throw new InvalidStepError('BUY', 'lowestListing is required');
		}

		return (
			<ActionButtonBody
				action={CollectibleCardAction.BUY}
				tokenId={tokenId}
				label="Buy now"
				onClick={() =>
					showBuyModal({
						collectionAddress,
						chainId,
						tokenId,
						order: lowestListing,
					})
				}
				icon={SvgCartIcon}
			/>
		);
	}

	if (action === CollectibleCardAction.OFFER) {
		return (
			<ActionButtonBody
				action={CollectibleCardAction.OFFER}
				tokenId={tokenId}
				label="Make an offer"
				onClick={() =>
					showMakeOfferModal({
						collectionAddress,
						chainId,
						collectibleId: tokenId,
						orderbookKind,
					})
				}
			/>
		);
	}

	return null;
}
