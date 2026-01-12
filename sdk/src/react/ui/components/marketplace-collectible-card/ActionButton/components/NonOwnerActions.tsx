'use client';

import type { Address, Order } from '@0xsequence/api-client';
import { CartIcon } from '@0xsequence/design-system';
import { CollectibleCardAction } from '../../../../../../types';
import { useBuyModal } from '../../../../modals/BuyModal';
import { useMakeOfferModal } from '../../../../modals/MakeOfferModal';
import { ActionButtonBody } from './ActionButtonBody';

type NonOwnerActionsBaseProps = {
	action: CollectibleCardAction;
	tokenId: bigint;
	collectionAddress: Address;
	chainId: number;
	quantityRemaining?: bigint;
	unlimitedSupply?: boolean;
	hideQuantitySelector?: boolean;
	labelOverride?: {
		offer?: string;
		buy?: string;
	};
	className?: string;
};

type ShopNonOwnerActionsProps = NonOwnerActionsBaseProps & {
	cardType: 'shop';
	salesContractAddress: Address;
	salePrice: {
		amount: bigint;
		currencyAddress: Address;
	};
	lowestListing?: never;
};

type MarketNonOwnerActionsProps = NonOwnerActionsBaseProps & {
	cardType: 'market';
	lowestListing?: Order;
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
		cardType,
		hideQuantitySelector,
		labelOverride,
		className,
	} = props;

	const { show: showBuyModal } = useBuyModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();

	if (cardType === 'shop') {
		const { salesContractAddress } = props;

		return (
			<ActionButtonBody
				action={CollectibleCardAction.BUY}
				tokenId={tokenId}
				label={labelOverride?.buy ?? 'Buy now'}
				onClick={() =>
					showBuyModal({
						chainId,
						collectionAddress,
						salesContractAddress,
						item: {
							tokenId,
						},
						cardType: 'shop',
						hideQuantitySelector,
					})
				}
				icon={<CartIcon />}
				className={className}
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
				label={labelOverride?.buy ?? 'Buy now'}
				onClick={() =>
					showBuyModal({
						collectionAddress,
						chainId,
						tokenId,
						orderId: lowestListing.orderId,
						marketplace: lowestListing.marketplace,
						cardType: 'market',
						hideQuantitySelector,
					})
				}
				icon={<CartIcon />}
				className={className}
			/>
		);
	}

	if (action === CollectibleCardAction.OFFER) {
		return (
			<ActionButtonBody
				action={CollectibleCardAction.OFFER}
				tokenId={tokenId}
				label={labelOverride?.offer ?? 'Make an offer'}
				onClick={() =>
					showMakeOfferModal({
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
