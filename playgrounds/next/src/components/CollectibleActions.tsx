'use client';

import type { Order, OrderbookKind } from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useCreateListingModal,
	useMakeOfferModal,
	useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

export interface CollectibleActionsProps {
	isOwner: boolean;
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
	orderbookKind: OrderbookKind | undefined;
	lowestListing: Order | undefined;
}

export function CollectibleActions({
	isOwner,
	collectionAddress,
	chainId,
	collectibleId,
	orderbookKind,
	lowestListing,
}: CollectibleActionsProps) {
	const { isConnected } = useAccount();
	const shouldShowBuyButton = !!lowestListing;

	const { show: openBuyModal } = useBuyModal({
		onSuccess: ({ hash }) => {
			console.log('Buy success', hash);
			// You could add a toast notification here
		},
	});

	const { show: openMakeOfferModal } = useMakeOfferModal({
		onSuccess: ({ hash }) => {
			console.log('Offer made successfully', hash);
		},
		onError: (error) => {
			console.error('Error making offer', error);
		},
	});

	const { show: openCreateListingModal } = useCreateListingModal({
		onSuccess: ({ hash }) => {
			console.log('Listing created successfully', hash);
		},
		onError: (error) => {
			console.error('Error creating listing', error);
		},
	});

	const { show: openTransferModal } = useTransferModal();

	const hooksProps = {
		collectionAddress,
		chainId,
		collectibleId,
	};

	if (!isConnected) {
		return (
			<div className="p-4 bg-gray-800 rounded-lg border border-gray-700/30 shadow-md">
				<p className="text-gray-300">
					Connect Wallet to see collectible actions
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 p-4 bg-gray-800 rounded-lg border border-gray-700/30 shadow-md">
			{shouldShowBuyButton && (
				<div>
					<button
						type="button"
						className={`w-full py-2 px-4 rounded-md transition-colors ${
							isOwner
								? 'bg-gray-700 text-gray-500 cursor-not-allowed'
								: 'bg-blue-600 text-white hover:bg-blue-700'
						}`}
						onClick={() =>
							openBuyModal({
								...hooksProps,
								tokenId: collectibleId,
								order: lowestListing,
							})
						}
						disabled={isOwner}
					>
						Buy Now
					</button>
				</div>
			)}

			<div className="flex gap-3">
				<button
					type="button"
					className={`flex-1 py-2 px-4 rounded-md transition-colors ${
						isOwner
							? 'bg-gray-700 text-gray-500 cursor-not-allowed'
							: 'bg-blue-600 text-white hover:bg-blue-700'
					}`}
					onClick={() =>
						openMakeOfferModal({
							...hooksProps,
							orderbookKind,
						})
					}
					disabled={isOwner}
				>
					Make Offer
				</button>
			</div>

			<div className="flex gap-3">
				<button
					type="button"
					className={`flex-1 py-2 px-4 rounded-md transition-colors ${
						!isOwner
							? 'bg-gray-700 text-gray-500 cursor-not-allowed'
							: 'bg-blue-600 text-white hover:bg-blue-700'
					}`}
					onClick={() =>
						openCreateListingModal({
							...hooksProps,
							orderbookKind,
						})
					}
					disabled={!isOwner}
				>
					Create Listing
				</button>

				<button
					type="button"
					className={`flex-1 py-2 px-4 rounded-md transition-colors ${
						!isOwner
							? 'bg-gray-700 text-gray-500 cursor-not-allowed'
							: 'bg-blue-600 text-white hover:bg-blue-700'
					}`}
					onClick={() =>
						openTransferModal({
							collectionAddress,
							chainId,
							collectibleId,
						})
					}
					disabled={!isOwner}
				>
					Transfer
				</button>
			</div>
		</div>
	);
}
