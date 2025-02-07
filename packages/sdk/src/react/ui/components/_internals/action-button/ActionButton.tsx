'use client';

import { Button } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { InvalidStepError } from '../../../../../utils/_internal/error/transaction';
import type { Order, OrderbookKind } from '../../../../_internal';
import { useBuyModal } from '../../../modals/BuyModal';
import { useCreateListingModal } from '../../../modals/CreateListingModal';
import { useMakeOfferModal } from '../../../modals/MakeOfferModal';
import { useSellModal } from '../../../modals/SellModal';
import { useTransferModal } from '../../../modals/TransferModal';

import { CollectibleCardAction } from './types';
import { actionButton } from './styles.css';
import SvgCartIcon from '../../../icons/CartIcon';
import { useAccount } from 'wagmi';
import { useOpenConnectModal } from '@0xsequence/kit';
import {
	setPendingAction,
	executePendingActionIfExists,
	actionButtonStore,
} from './store';
import { useEffect } from 'react';

type ActionButtonProps = {
	chainId: string;
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
	}: ActionButtonProps) => {
		const { show: showCreateListingModal } = useCreateListingModal();
		const { show: showMakeOfferModal } = useMakeOfferModal();
		const { show: showSellModal } = useSellModal();
		const { show: showTransferModal } = useTransferModal();
		const { show: showBuyModal } = useBuyModal();
		const { address } = useAccount();
		const actionsThatOwnersCannotPerform = [
			CollectibleCardAction.BUY,
			CollectibleCardAction.OFFER,
		];
		const pendingActionType = actionButtonStore.pendingAction.type.get();

		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
			if (
				owned &&
				actionButtonStore.pendingAction.get() &&
				address &&
				!actionsThatOwnersCannotPerform.includes(action) &&
				actionButtonStore.pendingAction.get()?.collectibleId === tokenId
			) {
				onCannotPerformAction?.(
					pendingActionType as
						| CollectibleCardAction.BUY
						| CollectibleCardAction.OFFER,
				);
			}
		}, [
			owned,
			actionButtonStore.pendingAction.get(),
			address,
			action,
			tokenId,
		]);

		// Execute pending action when user becomes connected
		useEffect(() => {
			if (
				address &&
				!owned &&
				actionButtonStore.pendingAction.get() &&
				actionButtonStore.pendingAction.get()?.collectibleId === tokenId
			) {
				executePendingActionIfExists();
			}
		}, [address, owned, tokenId]);

		// Only show buy and make offer for unconnected users
		if (
			!address &&
			![CollectibleCardAction.BUY, CollectibleCardAction.OFFER].includes(action)
		) {
			return null;
		}

		// Owner-specific actions
		if (address && owned) {
			// Allow listing, transfer, sell for owners
			if (
				[
					CollectibleCardAction.LIST,
					CollectibleCardAction.TRANSFER,
					CollectibleCardAction.SELL,
				].includes(action)
			) {
				return (
					(action === CollectibleCardAction.LIST && (
						<ActionButtonBody
							label="Create listing"
							tokenId={tokenId}
							onClick={() =>
								showCreateListingModal({
									collectionAddress: collectionAddress as Hex,
									chainId: chainId,
									collectibleId: tokenId,
									orderbookKind,
								})
							}
						/>
					)) ||
					(action === CollectibleCardAction.SELL && highestOffer && (
						<ActionButtonBody
							tokenId={tokenId}
							label="Sell"
							onClick={() =>
								showSellModal({
									collectionAddress,
									chainId: chainId,
									tokenId: tokenId,
									order: highestOffer,
								})
							}
						/>
					)) ||
					(action === CollectibleCardAction.TRANSFER && (
						<ActionButtonBody
							label="Transfer"
							tokenId={tokenId}
							onClick={() =>
								showTransferModal({
									collectionAddress: collectionAddress as Hex,
									chainId: chainId,
									collectibleId: tokenId,
								})
							}
						/>
					))
				);
			}
		}

		// Non-owner actions
		if (action === CollectibleCardAction.BUY) {
			if (!lowestListing)
				throw new InvalidStepError('BUY', 'lowestListing is required');

			return (
				<ActionButtonBody
					action={CollectibleCardAction.BUY}
					tokenId={tokenId}
					label="Buy now"
					onClick={() =>
						showBuyModal({
							collectionAddress,
							chainId: chainId,
							tokenId: tokenId,
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
							collectionAddress: collectionAddress as Hex,
							chainId: chainId,
							collectibleId: tokenId,
							orderbookKind,
						})
					}
				/>
			);
		}

		return null;
	},
);

type ActionButtonBodyProps = {
	label: 'Buy now' | 'Sell' | 'Make an offer' | 'Create listing' | 'Transfer';
	tokenId: string;
	onClick: () => void;
	icon?: React.ComponentType<{
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
	}>;
	action?: CollectibleCardAction.BUY | CollectibleCardAction.OFFER;
};

function ActionButtonBody({
	tokenId,
	label,
	onClick,
	icon,
	action,
}: ActionButtonBodyProps) {
	const { address } = useAccount();
	const { setOpenConnectModal } = useOpenConnectModal();

	return (
		<Button
			className={actionButton}
			variant="primary"
			label={label}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!address) {
					setPendingAction(
						action as CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
						onClick,
						tokenId,
					);
					setOpenConnectModal(true);
				} else {
					onClick();
				}
			}}
			leftIcon={icon}
			size="xs"
			shape="square"
			width="full"
		/>
	);
}
