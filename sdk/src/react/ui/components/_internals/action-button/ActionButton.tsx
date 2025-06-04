'use client';

import { observer } from '@legendapp/state/react';
import type { Address, Hex } from 'viem';
import type {
	CollectibleCardAction,
	MarketplaceType,
} from '../../../../../types';
import type { Order, OrderbookKind } from '../../../../_internal';
import { NonOwnerActions } from './components/NonOwnerActions';
import { OwnerActions } from './components/OwnerActions';
import { useActionButtonLogic } from './hooks/useActionButtonLogic';

type ActionButtonProps = {
	chainId: number;
	collectionAddress: Hex;
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
	marketplaceType: MarketplaceType;
	salesContractAddress?: Address;
	prioritizeOwnerActions?: boolean;
	salePrice?: {
		amount: string;
		currencyAddress: Address;
	};
	quantityDecimals?: number;
	quantityRemaining?: number;
};

export const ActionButton = observer(
	({
		collectionAddress,
		chainId,
		tokenId,
		orderbookKind,
		action,
		owned,
		highestOffer,
		lowestListing,
		onCannotPerformAction,
		marketplaceType,
		salesContractAddress,
		prioritizeOwnerActions,
		salePrice,
		quantityDecimals,
		quantityRemaining,
	}: ActionButtonProps) => {
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
				/>
			);
		}

		const nonOwnerProps =
			marketplaceType === 'shop' && salesContractAddress && salePrice
				? {
						marketplaceType: 'shop' as const,
						salesContractAddress,
						salePrice,
						action,
						tokenId,
						collectionAddress,
						chainId,
						quantityDecimals,
						quantityRemaining,
					}
				: {
						marketplaceType: 'market' as const,
						orderbookKind,
						lowestListing,
						action,
						tokenId,
						collectionAddress,
						chainId,
						quantityDecimals,
						quantityRemaining,
					};

		return <NonOwnerActions {...nonOwnerProps} />;
	},
);
