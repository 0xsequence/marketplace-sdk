import { Card, Text } from '@0xsequence/design-system';
import { useMarketplace } from 'shared-components';
import {
	useCurrencies,
	useHighestOffer,
	useLowestListing,
} from '../../../../../packages/sdk/src/react';

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
		<Card className="p-6 bg-background-secondary rounded-xl shadow-lg border border-border-base">
			<div className="space-y-6">
				{/* Basic Info Section */}
				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<Text className="text-sm text-text-50 font-medium">Name</Text>
						<Text className="font-medium text-text-100">
							{name || 'Unnamed'}
						</Text>
					</div>
					<div className="flex justify-between items-center">
						<Text className="text-sm text-text-50 font-medium">ID</Text>
						<Text className="font-medium font-mono text-text-100">{id}</Text>
					</div>
					<div className="flex justify-between items-center">
						<Text className="text-sm text-text-50 font-medium">
							Your Balance
						</Text>
						<Text className="font-medium text-text-100	">{balance} items</Text>
					</div>
				</div>

				{/* Market Info Section */}
				<div className="space-y-4 pt-4 border-t border-border-base">
					<div className="flex justify-between items-center bg-background-backdrop p-3 rounded-lg">
						<Text className="text-sm text-text-50 font-medium">
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
					<div className="flex justify-between items-center bg-background-backdrop p-3 rounded-lg">
						<Text className="text-sm text-text-50 font-medium">
							Highest Offer
						</Text>
						<Text className="font-semibold text-text-100">
							{highestOffer?.order?.priceAmountFormatted || '—'}{' '}
							<span className="text-text-80">
								{currencies?.find(
									(c) =>
										c.contractAddress ===
										highestOffer?.order?.priceCurrencyAddress,
								)?.symbol || ''}
							</span>
						</Text>
					</div>
				</div>
			</div>
		</Card>
	);
};
