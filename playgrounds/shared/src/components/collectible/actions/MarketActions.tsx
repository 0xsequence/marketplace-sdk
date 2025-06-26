import {
	AddIcon,
	Button,
	Card,
	CartIcon,
	SendIcon,
	Text,
	useToast,
} from '@0xsequence/design-system';
import {
	useBuyModal,
	useCreateListingModal,
	useMakeOfferModal,
	useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import type { Order, OrderbookKind } from '../../../../../../sdk/src/types';

export function MarketActionsCard({
	lowestListing,
	orderbookKind,
	collectionAddress,
	chainId,
	collectibleId,
	isOwner,
}: {
	lowestListing: Order | undefined | null;
	orderbookKind: OrderbookKind | undefined;
	collectionAddress: Address;
	chainId: number;
	collectibleId: string;
	isOwner: boolean;
}) {
	const toast = useToast();
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
								})
							}
							leftIcon={CartIcon}
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
