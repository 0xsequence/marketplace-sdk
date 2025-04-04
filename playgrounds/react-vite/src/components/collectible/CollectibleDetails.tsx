import { Card, Text } from '@0xsequence/design-system';
import {
	useCurrencies,
	useHighestOffer,
	useLowestListing,
} from '@0xsequence/marketplace-sdk/react';
import { useMarketplace } from 'shared-components';

export interface CollectibleDetailsProps {
	name?: string;
	id: string;
	balance?: number;
}

export const CollectibleDetails = ({
	name,
	id,
	balance = 0,
}: CollectibleDetailsProps) => {
	const { chainId, collectionAddress, collectibleId } = useMarketplace();
	const { data: lowestListing } = useLowestListing({
		collectionAddress,
		chainId,
		tokenId: collectibleId,
	});
	const { data: highestOffer } = useHighestOffer({
		collectionAddress,
		chainId,
		tokenId: collectibleId,
	});
	const { data: currencies } = useCurrencies({
		chainId,
	});

	return (
		<Card className="rounded-xl border border-border-base bg-background-secondary p-6 shadow-lg">
			<div className="space-y-6">
				{/* Basic Info Section */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Text className="font-medium text-sm text-text-50">Name</Text>
						<Text className="font-medium text-text-100">
							{name || 'Unnamed'}
						</Text>
					</div>
					<div className="flex items-center justify-between">
						<Text className="font-medium text-sm text-text-50">ID</Text>
						<Text className="font-medium font-mono text-text-100">{id}</Text>
					</div>
					<div className="flex items-center justify-between">
						<Text className="font-medium text-sm text-text-50">
							Your Balance
						</Text>
						<Text className="font-medium text-text-100">{balance} items</Text>
					</div>
				</div>

				{/* Market Info Section */}
				<div className="space-y-4 border-border-base border-t pt-4">
					<div className="flex items-center justify-between rounded-lg bg-background-backdrop p-3">
						<Text className="font-medium text-sm text-text-50">
							Lowest Listing
						</Text>
						<Text className="font-semibold text-text-100">
							{lowestListing?.order?.priceAmountFormatted || '—'}{' '}
							<span className="text-text-80">
								{currencies?.find(
									(c) =>
										c.contractAddress ===
										lowestListing?.order?.priceCurrencyAddress,
								)?.symbol || ''}
							</span>
						</Text>
					</div>
					<div className="flex items-center justify-between rounded-lg bg-background-backdrop p-3">
						<Text className="font-medium text-sm text-text-50">
							Highest Offer
						</Text>
						<Text className="font-semibold text-text-100">
							{highestOffer?.priceAmountFormatted || '—'}{' '}
							<span className="text-text-80">
								{currencies?.find(
									(c) =>
										c.contractAddress === highestOffer?.priceCurrencyAddress,
								)?.symbol || ''}
							</span>
						</Text>
					</div>
				</div>
			</div>
		</Card>
	);
};
