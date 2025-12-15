import {
	AddIcon,
	Button,
	Card,
	CartIcon,
	SendIcon,
	Text,
} from '@0xsequence/design-system';
import type { Order, OrderbookKind } from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useCreateListingModal,
	useMakeOfferModal,
	useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';

export function MarketActionsCard({
	lowestListing,
	orderbookKind,
	collectionAddress,
	chainId,
	tokenId,
	isOwner,
}: {
	lowestListing: Order | undefined | null;
	orderbookKind: OrderbookKind | undefined;
	collectionAddress: Address;
	chainId: number;
	tokenId: bigint;
	isOwner: boolean;
}) {
	const shouldShowBuyButton = !!lowestListing;

	const { show: openBuyModal } = useBuyModal();
	const { show: openMakeOfferModal } = useMakeOfferModal();

	const { show: openCreateListingModal } = useCreateListingModal();

	const { show: openTransferModal } = useTransferModal({
		prefetch: {
			collectionAddress,
			chainId,
			tokenId,
		},
	});

	const hooksProps = {
		collectionAddress,
		chainId,
		tokenId,
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
									tokenId,
									orderId: lowestListing.orderId,
									marketplace: lowestListing.marketplace,
								})
							}
							disabled={isOwner}
							className="w-full"
						>
							<CartIcon />
							Buy Now
						</Button>
					</div>
				)}

				{!isOwner && (
					<Button
						variant="secondary"
						onClick={() =>
							openMakeOfferModal({
								collectionAddress,
								chainId,
								tokenId,
								orderbookKind,
							})
						}
						className="w-full"
					>
						<AddIcon />
						Make Offer
					</Button>
				)}

				{isOwner && (
					<div className="flex flex-col gap-2">
						<Text variant="small" color="text80">
							Owner Actions
						</Text>
						<div className="flex flex-row gap-2">
							<Button
								variant="secondary"
								onClick={() =>
									openCreateListingModal({
										...hooksProps,
									})
								}
								className="w-full"
							>
								Create Listing
								<AddIcon />
							</Button>
							<Button
								variant="secondary"
								onClick={() =>
									openTransferModal({
										collectionAddress,
										chainId,
										tokenId,
									})
								}
								className="w-full"
							>
								Transfer
								<SendIcon />
							</Button>
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
