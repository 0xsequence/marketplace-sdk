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
	tokenId: bigint;
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
		amount: bigint;
		currencyAddress: Address;
	};
	quantityRemaining?: bigint;
	unlimitedSupply?: boolean;
	hideQuantitySelector?: boolean;
	labelOverride?: {
		listing?: string;
		offer?: string;
		buy?: string;
		sell?: string;
		transfer?: string;
	};
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
	quantityRemaining,
	unlimitedSupply,
	hideQuantitySelector,
	labelOverride,
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
				labelOverride={labelOverride}
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
					quantityRemaining,
					unlimitedSupply,
					hideQuantitySelector,
					labelOverride,
				}
			: {
					cardType: 'market' as const,
					orderbookKind,
					lowestListing,
					action,
					tokenId,
					collectionAddress,
					chainId,
					quantityRemaining,
					hideQuantitySelector,
					labelOverride,
				};

	return <NonOwnerActions {...nonOwnerProps} className={className} />;
}
