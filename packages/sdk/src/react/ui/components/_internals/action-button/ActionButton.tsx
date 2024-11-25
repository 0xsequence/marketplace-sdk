'use client';

import { Button } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import {
	useBalanceOfCollectible,
	useHighestOffer,
	useLowestListing,
} from '../../../../hooks';
import { useCreateListingModal } from '../../../modals/CreateListingModal';
import { useMakeOfferModal } from '../../../modals/MakeOfferModal';
import { useSellModal } from '../../../modals/SellModal';
import { useTransferModal } from '../../../modals/TransferModal';

type ActionButtonProps = {
	chainId: string;
	collectionAddress: string;
	tokenId: string;
	isTransfer?: boolean;
};

export const ActionButton = observer(function AddToCartButton({
	collectionAddress,
	chainId,
	tokenId,
	isTransfer,
}: ActionButtonProps) {
	const { address: accountAddress } = useAccount();
	//TODO: this should not call all of these endpoints on every card
	const { data: balance, isLoading: balanceLoading } = useBalanceOfCollectible({
		chainId,
		collectionAddress,
		collectableId: tokenId,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		userAddress: accountAddress!,
	});
	const { data: highestOffer, isLoading: highestOfferLoading } =
		useHighestOffer({
			collectionAddress: collectionAddress as Hex,
			chainId: String(chainId),
			tokenId: tokenId,
		});
	const { data: lowestListing, isLoading: lowestListingLoading } =
		useLowestListing({
			collectionAddress: collectionAddress as Hex,
			chainId: String(chainId),
			tokenId: tokenId,
		});
	const collectibleOwned = balance?.balance ?? 0;

	const { show: showCreateListingModal } = useCreateListingModal();
	const { show: showMakeOfferModal } = useMakeOfferModal();
	const { show: showSellModal } = useSellModal();
	const { show: showTransferModal } = useTransferModal();

	if (
		balanceLoading ||
		highestOfferLoading ||
		lowestListingLoading ||
		!accountAddress
	) {
		return null;
	}

	if (isTransfer && collectibleOwned) {
		return (
			<ActionButtonBody
				label="Transfer"
				onClick={() =>
					showTransferModal({
						collectionAddress: collectionAddress as Hex,
						chainId: chainId,
						tokenId: tokenId,
					})
				}
			/>
		);
	}

	if (!collectibleOwned) {
		return (
			<ActionButtonBody
				label="Make an offer"
				onClick={() =>
					showMakeOfferModal({
						collectionAddress: collectionAddress as Hex,
						chainId: chainId,
						collectibleId: tokenId,
					})
				}
			/>
		);
	}

	if (!collectibleOwned && lowestListing?.order) {
		return (
			<ActionButtonBody
				label="Add to cart"
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				onClick={() => {}}
			/>
		);
	}

	if (collectibleOwned && !lowestListing?.order) {
		return (
			<ActionButtonBody
				label="Create listing"
				onClick={() =>
					showCreateListingModal({
						collectionAddress: collectionAddress as Hex,
						chainId: chainId,
						collectibleId: tokenId,
					})
				}
			/>
		);
	}

	if (collectibleOwned && highestOffer?.order) {
		return (
			<ActionButtonBody
				label="Sell"
				onClick={() =>
					showSellModal({
						collectionAddress: collectionAddress as Hex,
						chainId: chainId,
						tokenId: tokenId,
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						order: highestOffer.order!,
					})
				}
			/>
		);
	}

	return null;
});

type ActionButtonBodyProps = {
	label: string;
	onClick: () => void;
};

function ActionButtonBody({ label, onClick }: ActionButtonBodyProps) {
	return (
		<Button
			variant="primary"
			label={label}
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick();
			}}
			// leftIcon={leftIcon}
			size="xs"
			shape="square"
			width="full"
		/>
	);
}
