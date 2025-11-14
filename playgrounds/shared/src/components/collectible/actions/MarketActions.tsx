import {
	AddIcon,
	Button,
	Card,
	CartIcon,
	SendIcon,
	Text,
} from '@0xsequence/design-system';
import {
	useBuyModal,
	useCreateListingModal,
	useMakeOfferModal,
	useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import { toast } from 'sonner';
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
	const shouldShowBuyButton = !!lowestListing;

	const { show: openBuyModal } = useBuyModal({
		onSuccess: ({ hash }) => {
			toast.success(
				`Your purchase was successful!${hash ? ` Transaction: ${hash.slice(0, 10)}...` : ''}`,
			);
		},
	});
	const { show: openMakeOfferModal } = useMakeOfferModal({
		onSuccess: ({ hash }) => {
			toast.success(
				`Your offer has been made!${hash ? ` Transaction: ${hash.slice(0, 10)}...` : ''}`,
			);
		},
		onError: (error) => {
			console.error(error);
			toast.error(`An error occurred while making your offer: ${error.name}`);
		},
	});

	const { show: openCreateListingModal } = useCreateListingModal({
		onSuccess: ({ hash }) => {
			toast.success(
				`Your listing has been created!${hash ? ` Transaction: ${hash.slice(0, 10)}...` : ''}`,
			);
		},
		onError: (error) => {
			console.error('Error creating listing', error);
			toast.error(
				`An error occurred while creating your listing: ${error.name}`,
			);
		},
	});

	const { show: openTransferModal } = useTransferModal({
		isPrefetching: {
			collectionAddress,
			chainId,
			collectibleId,
		},
	});

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
