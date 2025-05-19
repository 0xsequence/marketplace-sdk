'use client';

import type { Address } from 'viem';
import { CollectibleCardAction } from '../../../../../../types';
import type { Order, OrderbookKind } from '../../../../../_internal';
import SvgCartIcon from '../../../../icons/CartIcon';
import { useBuyModal } from '../../../../modals/BuyModal';
import { useMakeOfferModal } from '../../../../modals/MakeOfferModal';
import { ActionButtonBody } from './ActionButtonBody';

type NonOwnerActionsBaseProps = {
	action: CollectibleCardAction;
	tokenId: string;
	collectionAddress: Address;
	chainId: number;
	quantityDecimals?: number;
	quantityRemaining?: string;
};

type ShopNonOwnerActionsProps = NonOwnerActionsBaseProps & {
	marketplaceType: 'shop';
	salesContractAddress: Address;
	salePrice: {
		amount: string;
		currencyAddress: Address;
	};
	lowestListing?: never;
	orderbookKind?: never;
};

type MarketNonOwnerActionsProps = NonOwnerActionsBaseProps & {
	marketplaceType: 'market';
	lowestListing?: Order;
	orderbookKind?: OrderbookKind;
	salesContractAddress?: never;
	salePrice?: never;
};

type NonOwnerActionsProps =
	| ShopNonOwnerActionsProps
	| MarketNonOwnerActionsProps;

export function NonOwnerActions(props: NonOwnerActionsProps) {
	const {
		action,
		tokenId,
		collectionAddress,
		chainId,
		quantityDecimals,
		quantityRemaining,
		marketplaceType,
	} = props;

	const { show: showBuyModal } = useBuyModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();

	if (marketplaceType === 'shop') {
		const { salesContractAddress, salePrice } = props;

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
						marketplaceType: 'shop',
						salePrice: {
							amount: salePrice.amount,
							currencyAddress: salePrice.currencyAddress,
						},
						quantityDecimals: quantityDecimals ?? 0,
						quantityRemaining: quantityRemaining ?? '',
					})
				}
				icon={SvgCartIcon}
			/>
		);
	}

	if (action === CollectibleCardAction.BUY) {
		const { lowestListing } = props;
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
						marketplaceType: 'market',
						quantityDecimals: lowestListing.quantityDecimals,
						quantityRemaining: lowestListing.quantityRemaining,
					})
				}
				icon={SvgCartIcon}
			/>
		);
	}

	if (action === CollectibleCardAction.OFFER) {
		const { orderbookKind } = props;
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
