'use client';

import type { Hex } from 'viem';
import { InvalidStepError } from '../../../../../../utils/_internal/error/transaction';
import {
	MarketplaceType,
	type Order,
	type OrderbookKind,
} from '../../../../../_internal';
import SvgCartIcon from '../../../../icons/CartIcon';
import { useBuyModal } from '../../../../modals/BuyModal';
import { useMakeOfferModal } from '../../../../modals/MakeOfferModal';
import { CollectibleCardType } from '../../../collectible-card';
import { CollectibleCardAction } from '../types';
import { ActionButtonBody } from './ActionButtonBody';

type NonOwnerActionsProps = {
	action: CollectibleCardAction;
	tokenId: string;
	collectionAddress: Hex;
	chainId: number;
	orderbookKind?: OrderbookKind;
	lowestListing?: Order;
	cardType: CollectibleCardType;
	salesContractAddress?: Hex;
};

export function NonOwnerActions({
	action,
	tokenId,
	collectionAddress,
	chainId,
	orderbookKind,
	lowestListing,
	cardType,
	salesContractAddress,
}: NonOwnerActionsProps) {
	const { show: showBuyModal } = useBuyModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();

	if (cardType === CollectibleCardType.SHOP) {
		if (!salesContractAddress) {
			throw new Error('salesContractAddress is required for SHOP card type');
		}

		return (
			<ActionButtonBody
				action={CollectibleCardAction.BUY}
				tokenId={tokenId}
				label="Buy now"
				onClick={() =>
					showBuyModal({
						chainId,
						collectionAddress,
						salesContractAddress,
						items: [
							{
								tokenId,
								quantity: '1',
							},
						],
						marketplaceType: MarketplaceType.SHOP,
						salePrice: {
							amount: '10',
							currencyAddress: '0x0000000000000000000000000000000000000000',
						},
					})
				}
				icon={SvgCartIcon}
			/>
		);
	}

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
						collectibleId: tokenId,
						orderId: lowestListing.orderId,
						marketplace: lowestListing.marketplace,
						marketplaceType: MarketplaceType.MARKET,
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
