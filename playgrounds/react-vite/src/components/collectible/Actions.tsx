import { Button, Card, Text, useToast } from '@0xsequence/design-system';
import {
	useMakeOfferModal,
	useCreateListingModal,
	useTransferModal,
	useBuyModal,
} from '@0xsequence/marketplace-sdk/react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import type { Order, OrderbookKind } from '../../../../../packages/sdk/src';

export interface ActionsProps {
	isOwner: boolean;
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
	orderbookKind: OrderbookKind | undefined;
	lowestListing: Order | undefined;
}

export const Actions = ({
	isOwner,
	collectionAddress,
	chainId,
	collectibleId,
	orderbookKind,
	lowestListing,
}: ActionsProps) => {
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
			<div>
				<Text variant="large">Connect Wallet to see collectable actions</Text>
			</div>
		);
	}

	return (
		<Card gap="6" justifyContent="center">
			{shouldShowBuyButton && (
				<div className='gap-3'>
					<Button
						variant="primary"
						onClick={() =>
							openBuyModal({
								...hooksProps,
								tokenId: collectibleId,
								order: lowestListing,
							})
						}
						disabled={isOwner}
						label="Buy Now"
					/>
				</div>
			)}

			<div className='flex gap-3'>
				<Button
					variant="primary"
					onClick={() =>
						openMakeOfferModal({
							...hooksProps,
							orderbookKind,
						})
					}
					label="Make Offer"
					disabled={isOwner}
				/>
			</div>
			<div className="flex gap-3">
				<Button
					variant="primary"
					onClick={() =>
						openCreateListingModal({
							...hooksProps,
							orderbookKind,
						})
					}
					label="Create Listing"
					disabled={!isOwner}
				/>
				<Button
					variant="primary"
					onClick={() =>
						openTransferModal({
							collectionAddress,
							chainId,
							collectibleId,
						})
					}
					label="Transfer"
					disabled={!isOwner}
				/>
			</div>
		</Card>
	);
};
