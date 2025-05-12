'use client';

import type { Address, Hex } from 'viem';
import { MarketplaceType } from '../../../../../../types';
import { CollectibleCardAction } from '../../../../../../types';
import type { Order, OrderbookKind } from '../../../../../_internal';
import SvgCartIcon from '../../../../icons/CartIcon';
import { useBuyModal } from '../../../../modals/BuyModal';
import { useMakeOfferModal } from '../../../../modals/MakeOfferModal';
import { ActionButtonBody } from './ActionButtonBody';

type NonOwnerActionsProps = {
	action: CollectibleCardAction;
	tokenId: string;
	collectionAddress: Hex;
	chainId: number;
	orderbookKind?: OrderbookKind;
	lowestListing?: Order;
	marketplaceType: MarketplaceType;
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
	marketplaceType,
	salesContractAddress,
	salePrice,
	quantityDecimals,
	quantityRemaining,
}: NonOwnerActionsProps) {
	const { show: showBuyModal } = useBuyModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();

	if (marketplaceType === MarketplaceType.SHOP) {
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
								// This is overridden by quantity input state, see: sdk/src/react/ui/modals/BuyModal/hooks/useERC1155Checkout.ts
								quantity: '',
							},
						],
						marketplaceType: MarketplaceType.SHOP,
						salePrice: {
							amount: salePrice?.amount ?? '',
							currencyAddress: salePrice?.currencyAddress ?? '0x',
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
