'use client';

import type { Address, Hex } from 'viem';
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
	salePrice?: {
		amount: string;
		currencyAddress: Address;
	};
	quantityDecimals?: number;
	quantityRemaining?: string;
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
	salePrice,
	quantityDecimals,
	quantityRemaining,
}: NonOwnerActionsProps) {
	const { show: showBuyModal } = useBuyModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();

	if (cardType === CollectibleCardType.SHOP) {
		if (
			!salesContractAddress ||
			!salePrice ||
			quantityDecimals === undefined ||
			quantityRemaining === undefined
		) {
			const missingFields = [];
			if (!salesContractAddress) missingFields.push('salesContractAddress');
			if (!salePrice) missingFields.push('salePrice');
			if (quantityDecimals === undefined)
				missingFields.push('quantityDecimals');
			if (quantityRemaining === undefined)
				missingFields.push('quantityRemaining');

			throw new Error(
				`${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required for SHOP card type`,
			);
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
						salePrice,
						quantityDecimals,
						quantityRemaining,
					})
				}
				icon={SvgCartIcon}
			/>
		);
	}

	if (action === CollectibleCardAction.BUY) {
		if (!lowestListing) {
			throw new Error(
				'lowestListing is required for BUY action and MARKET card type',
			);
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
						quantityDecimals: lowestListing.quantityDecimals,
						quantityRemaining: lowestListing.quantityRemaining,
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
