'use client';

import {
	AddIcon,
	Button,
	Card,
	SendIcon,
	Text,
	useToast,
} from '@0xsequence/design-system';
import type { Order, OrderbookKind } from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useCreateListingModal,
	useMakeOfferModal,
	useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { MarketplaceType } from '../../../../../sdk/src/react/_internal';
import SvgCartIcon from '../../../../../sdk/src/react/ui/icons/CartIcon';

export interface ActionsProps {
	isOwner: boolean;
	collectionAddress: Hex;
	chainId: number;
	collectibleId: string;
	orderbookKind: OrderbookKind | undefined;
	lowestListing: Order | undefined | null;
}

export function Actions({
	isOwner,
	collectionAddress,
	chainId,
	collectibleId,
	orderbookKind,
	lowestListing,
}: ActionsProps) {
	const toast = useToast();
	const { isConnected } = useAccount();
	const shouldShowBuyButton = !!lowestListing;

	const { show: openBuyModal } = useBuyModal({
		onSuccess: ({ hash }) => {
			toast({
				title: 'Your offer has been made',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
			});
		},
	});
	const { show: openMakeOfferModal } = useMakeOfferModal({
		onSuccess: ({ hash }) => {
			toast({
				title: 'Your offer has been made',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
			});
		},
		onError: (error) => {
			console.error(error);
			toast({
				title: `An error occurred while making your offer: ${error.name}`,
				variant: 'error',
				description: 'See console for more details',
			});
		},
	});

	const { show: openCreateListingModal } = useCreateListingModal({
		onSuccess: ({ hash }) => {
			toast({
				title: 'Your listing has been created',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
			});
		},
		onError: (error) => {
			console.error('Error creating listing', error);
			toast({
				title: `An error occurred while creating your listing: ${error.name}`,
				variant: 'error',
				description: 'See console for more details',
			});
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
			<Card className="flex items-center justify-center p-6">
				<Text className="text-center font-bold text-large">
					Connect Wallet to see collectable actions
				</Text>
			</Card>
		);
	}

	return (
		<Card className="flex flex-col gap-6 p-6">
			<div className="flex flex-col gap-4">
				<Text variant="large" className="font-semibold">
					{isOwner ? 'Owner Actions' : 'Buyer Actions'}
				</Text>

				{shouldShowBuyButton && (
					<div className="flex flex-col gap-2">
						<Text variant="small" color="text80">
							Current Price: ${lowestListing?.priceUSDFormatted}
						</Text>
						<Button
							variant="primary"
							onClick={() =>
								openBuyModal({
									collectionAddress,
									chainId,
									collectibleId,
									orderId: lowestListing.orderId,
									marketplace: lowestListing.marketplace,
									marketplaceType: MarketplaceType.MARKET,
									quantityDecimals: lowestListing.quantityDecimals,
									quantityRemaining: lowestListing.quantityRemaining,
								})
							}
							leftIcon={SvgCartIcon}
							disabled={isOwner}
							label="Buy Now"
							className="w-full"
						/>
					</div>
				)}

				{!isOwner && (
					<Button
						variant="glass"
						onClick={() =>
							openMakeOfferModal({
								...hooksProps,
								orderbookKind,
							})
						}
						leftIcon={AddIcon}
						label="Make Offer"
						className="w-full"
					/>
				)}

				{isOwner && (
					<div className="flex flex-col gap-2">
						<Text variant="small" color="text80">
							Owner Actions
						</Text>
						<div className="flex flex-row gap-2">
							<Button
								variant="glass"
								onClick={() =>
									openCreateListingModal({
										...hooksProps,
										orderbookKind,
									})
								}
								rightIcon={AddIcon}
								label="Create Listing"
								className="w-full"
							/>
							<Button
								variant="glass"
								onClick={() =>
									openTransferModal({
										collectionAddress,
										chainId,
										collectibleId,
									})
								}
								rightIcon={SendIcon}
								label="Transfer"
								className="w-full"
							/>
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
