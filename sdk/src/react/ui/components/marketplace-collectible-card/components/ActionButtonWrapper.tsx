'use client';

import type { Address } from 'viem';
import type {
	CollectibleCardAction,
	MarketplaceType,
} from '../../../../../types';
import type { Order, OrderbookKind } from '../../../../_internal';
import { ActionButton } from '../../_internals/action-button/ActionButton';

interface ActionButtonWrapperProps {
	show: boolean;
	chainId: number;
	collectionAddress: Address;
	tokenId: string;
	orderbookKind?: OrderbookKind;
	action: CollectibleCardAction;
	highestOffer?: Order;
	lowestListing?: Order;
	owned: boolean;
	onCannotPerformAction?: (
		action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
	) => void;
	marketplaceType: MarketplaceType;
	salesContractAddress?: Address;
	prioritizeOwnerActions?: boolean;
	salePrice?: {
		amount: string;
		currencyAddress: Address;
	};
	quantityDecimals?: number;
	quantityRemaining?: number;
	unlimitedSupply?: boolean;
}

export function ActionButtonWrapper({
	show,
	chainId,
	collectionAddress,
	tokenId,
	orderbookKind,
	action,
	highestOffer,
	lowestListing,
	owned,
	onCannotPerformAction,
	marketplaceType,
	salesContractAddress,
	prioritizeOwnerActions,
	salePrice,
	quantityDecimals,
	quantityRemaining,
	unlimitedSupply,
}: ActionButtonWrapperProps) {
	if (!show) return null;

	return (
		<div className="-bottom-16 absolute flex w-full origin-bottom items-center justify-center bg-overlay-light p-2 backdrop-blur transition-transform duration-200 ease-in-out group-hover:translate-y-[-64px]">
			<ActionButton
				chainId={chainId}
				collectionAddress={collectionAddress}
				tokenId={tokenId}
				orderbookKind={orderbookKind}
				action={action}
				highestOffer={highestOffer}
				lowestListing={lowestListing}
				owned={owned}
				onCannotPerformAction={onCannotPerformAction}
				marketplaceType={marketplaceType}
				salesContractAddress={salesContractAddress}
				prioritizeOwnerActions={prioritizeOwnerActions}
				salePrice={salePrice}
				quantityDecimals={quantityDecimals}
				quantityRemaining={quantityRemaining}
				unlimitedSupply={unlimitedSupply}
			/>
		</div>
	);
}
