import { Skeleton } from '@0xsequence/design-system';
import {
	useBalanceOfCollectible,
	useCollectible,
	useLowestListing,
} from '@0xsequence/marketplace-sdk/react';
import { Media } from '@0xsequence/marketplace-sdk/react';
import { Actions, ActivitiesTable, useMarketplace } from 'shared-components';
import ListingsTable from 'shared-components/src/components/ordersTable/ListingsTable';
import OffersTable from 'shared-components/src/components/ordersTable/OffersTable';
import { useAccount } from 'wagmi';
import { CollectibleDetails } from '../components/collectible';

function CollectibleSkeleton() {
	return (
		<div className="flex flex-col gap-3 pt-3">
			<div className="flex gap-3">
				<Skeleton className="h-[300px] w-[300px] overflow-hidden rounded-xl" />
				<div className="flex flex-1 flex-col gap-4">
					<Skeleton className="h-8 w-1/2" />
					<Skeleton className="h-6 w-1/4" />
					<Skeleton className="h-24 w-3/4" />
				</div>
			</div>
			<Skeleton className="h-12 w-full" />
			<Skeleton className="h-48 w-full" />
			<Skeleton className="h-48 w-full" />
			<Skeleton className="h-48 w-full" />
		</div>
	);
}

export function Collectible() {
	const { collectionAddress, chainId, collectibleId, orderbookKind } =
		useMarketplace();
	const { address: accountAddress } = useAccount();

	const { data: collectible, isLoading: isCollectibleLoading } = useCollectible(
		{
			collectionAddress,
			chainId,
			collectibleId,
		},
	);
	const { data: lowestListing } = useLowestListing({
		collectionAddress,
		chainId,
		tokenId: collectibleId,
	});
	const { data: balance } = useBalanceOfCollectible({
		collectionAddress,
		chainId,
		collectableId: collectibleId,
		userAddress: accountAddress,
	});

	if (isCollectibleLoading) {
		return <CollectibleSkeleton />;
	}

	if (!collectible) {
		return <div>Collectible not found</div>;
	}

	return (
		<div className="flex flex-col gap-3 pt-3">
			<div className="flex gap-3">
				<Media
					name={collectible.name}
					assets={[
						collectible.video,
						collectible.animation_url,
						collectible.image,
					]}
					className="h-[300px] w-[300px] overflow-hidden rounded-xl"
					isLoading={isCollectibleLoading}
				/>

				<CollectibleDetails
					name={collectible.name}
					id={collectibleId}
					balance={Number(balance?.balance)}
				/>
			</div>
			<Actions
				isOwner={!!balance?.balance}
				collectionAddress={collectionAddress}
				chainId={chainId}
				collectibleId={collectibleId}
				orderbookKind={orderbookKind}
				lowestListing={lowestListing || undefined}
			/>
			<ListingsTable
				chainId={chainId}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
			/>
			<OffersTable
				chainId={chainId}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
			/>
			<ActivitiesTable />
		</div>
	);
}
