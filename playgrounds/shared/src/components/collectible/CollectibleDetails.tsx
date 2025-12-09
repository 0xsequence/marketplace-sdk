import { Card, Separator, Text } from '@0xsequence/design-system';
import type { ContractInfo } from '@0xsequence/marketplace-sdk';
import { cn } from '@0xsequence/marketplace-sdk';
import {
	useHighestOffer,
	useLowestListing,
	useMarketCurrencies,
} from '@0xsequence/marketplace-sdk/react';
import { useMarketplace } from '../../store';

export interface CollectibleDetailsProps {
	name?: string;
	id: bigint;
	balance?: number;
	chainId: number;
	collection: ContractInfo | undefined;
	onCollectionClick: () => void;
}

export const CollectibleDetails = ({
	name,
	id,
	balance = 0,
	chainId,
	collection,
	onCollectionClick,
}: CollectibleDetailsProps) => {
	const { cardType } = useMarketplace();
	const isMarket = cardType === 'market';

	const { data: lowestListing } = useLowestListing({
		collectionAddress: collection?.address,
		chainId,
		tokenId: id,
		query: {
			enabled: isMarket,
		},
	});
	const { data: highestOffer } = useHighestOffer({
		collectionAddress: collection?.address,
		chainId,
		tokenId: id,
		query: {
			enabled: isMarket,
		},
	});
	const { data: currencies } = useMarketCurrencies({
		chainId,
	});

	return (
		<Card className="flex-1 rounded-xl border border-border-base bg-background-secondary p-6 shadow-lg">
			<div className="space-y-6">
				<button
					type="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							onCollectionClick();
						}
					}}
					aria-label={`View ${collection?.name} collection`}
					onClick={onCollectionClick}
					className="flex items-center gap-2 rounded-md bg-background-control px-2 py-1"
				>
					{(collection?.logoURI && (
						<img
							src={collection?.logoURI}
							alt={collection?.name}
							className={cn(
								'h-4 w-4 rounded-full',
								collection?.logoURI ? 'block' : 'hidden',
							)}
						/>
					)) ||
						'<'}

					<Text className="font-medium text-sm text-text-100">
						{collection?.name}
					</Text>
				</button>

				<Separator className="my-2" />

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
					{isMarket && (
						<div className="flex items-center justify-between">
							<Text className="font-medium text-sm text-text-50">
								Your Balance
							</Text>
							<Text className="font-medium text-text-100">{balance} items</Text>
						</div>
					)}
				</div>

				{/* Market Info Section */}
				{isMarket && (
					<div className="space-y-4 border-border-base border-t pt-4">
						<div className="flex items-center justify-between rounded-lg bg-background-backdrop p-3">
							<Text className="font-medium text-sm text-text-50">
								Lowest Listing
							</Text>
							<Text className="font-semibold text-text-100">
								{lowestListing?.priceAmountFormatted || '—'}{' '}
								<span className="text-text-80">
									{currencies?.find(
										(c: { contractAddress: string }) =>
											c.contractAddress === lowestListing?.priceCurrencyAddress,
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
										(c: { contractAddress: string }) =>
											c.contractAddress === highestOffer?.priceCurrencyAddress,
									)?.symbol || ''}
								</span>
							</Text>
						</div>
					</div>
				)}
			</div>
		</Card>
	);
};
