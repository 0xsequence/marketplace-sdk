'use client';

import type { Address } from 'viem';
import type { CardType, CollectibleCardAction } from '../../../../../types';
import type { Order, OrderbookKind } from '../../../../_internal';
import { NonOwnerActions } from './components/NonOwnerActions';
import { OwnerActions } from './components/OwnerActions';
import { useActionButtonLogic } from './hooks/useActionButtonLogic';

type ActionButtonProps = {
	chainId: number;
	collectionAddress: Address;
	tokenId: string;
	orderbookKind?: OrderbookKind;
	isTransfer?: boolean;
	action: CollectibleCardAction;
	owned?: boolean;
	highestOffer?: Order;
	lowestListing?: Order;
	onCannotPerformAction?: (
		action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
	) => void;
	cardType: CardType;
	salesContractAddress?: Address;
	prioritizeOwnerActions?: boolean;
	salePrice?: {
		amount: string;
		currencyAddress: Address;
	};
	quantityDecimals?: number;
	quantityRemaining?: number;
	unlimitedSupply?: boolean;
	hideQuantitySelector?: boolean;
	className?: string;
};

export function ActionButton({
	collectionAddress,
	chainId,
	tokenId,
	orderbookKind,
	action,
	owned,
	highestOffer,
	lowestListing,
	onCannotPerformAction,
	cardType,
	salesContractAddress,
	prioritizeOwnerActions,
	salePrice,
	quantityDecimals,
	quantityRemaining,
	unlimitedSupply,
	hideQuantitySelector,
	className,
}: ActionButtonProps) {
	const { shouldShowAction, isOwnerAction } = useActionButtonLogic({
		tokenId,
		owned,
		action,
		onCannotPerformAction,
	});

	if (!shouldShowAction) {
		return null;
	}

	if (isOwnerAction || prioritizeOwnerActions) {
		return (
			<OwnerActions
				action={action}
				tokenId={tokenId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				orderbookKind={orderbookKind}
				highestOffer={highestOffer}
				className={className}
			/>
		);
	}

	const nonOwnerProps =
		cardType === 'shop' && salesContractAddress && salePrice
			? {
					cardType: 'shop' as const,
					salesContractAddress,
					salePrice,
					action,
					tokenId,
					collectionAddress,
					chainId,
					quantityDecimals,
					quantityRemaining,
					unlimitedSupply,
					hideQuantitySelector,
				}
			: {
					cardType: 'market' as const,
					orderbookKind,
					lowestListing,
					action,
					tokenId,
					collectionAddress,
					chainId,
					quantityDecimals,
					quantityRemaining,
					hideQuantitySelector,
				};

	return <NonOwnerActions {...nonOwnerProps} className={className} />;
}
