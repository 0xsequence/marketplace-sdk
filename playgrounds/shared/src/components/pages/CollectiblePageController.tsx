'use client';

import { Skeleton } from '@0xsequence/design-system';
import {
	Media,
	useBalanceOfCollectible,
	useCollectible,
	useLowestListing,
} from '@0xsequence/marketplace-sdk/react';
import { useAccount } from 'wagmi';
import { CollectibleDetails } from '../collectible/CollectibleDetails';
import { Actions } from '../collectible/Actions';
import { ActivitiesTable } from '../activitiesTable/ActivitiesTable';
import ListingsTable from '../ordersTable/ListingsTable';
import OffersTable from '../ordersTable/OffersTable';
import { useMarketplace } from '../../store';

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

export interface CollectiblePageControllerProps {
	className?: string;
	mediaClassName?: string;
	showFullLayout?: boolean;
}

export function CollectiblePageController({
	className,
	mediaClassName,
	showFullLayout = true,
}: CollectiblePageControllerProps) {
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

	// Show skeleton loading state if enabled
	if (showFullLayout && isCollectibleLoading) {
		return <CollectibleSkeleton />;
	}

	// Show not found message if no collectible
	if (showFullLayout && !collectible && !isCollectibleLoading) {
		return <div>Collectible not found</div>;
	}

	// Use different media sizes based on layout preference
	const mediaSize = showFullLayout ? "h-[300px] w-[300px]" : "h-[168px] w-[168px]";
	const finalMediaClassName = mediaClassName || `${mediaSize} overflow-hidden rounded-xl`;

	return (
		<div className={`flex flex-col gap-3 pt-3 ${className || ''}`}>
			<div className="flex gap-3">
				<Media
					name={collectible?.name}
					assets={[
						collectible?.video,
						collectible?.animation_url,
						collectible?.image,
					]}
					className={finalMediaClassName}
					isLoading={isCollectibleLoading}
				/>

				{showFullLayout ? (
					<CollectibleDetails
						name={collectible?.name}
						id={collectibleId}
						balance={Number(balance?.balance)}
						chainId={chainId}
						collectionAddress={collectionAddress}
					/>
				) : (
					<div className="flex flex-col gap-1">
						<CollectibleDetails
							name={collectible?.name}
							id={collectibleId.toString()}
							balance={Number(balance?.balance)}
							chainId={chainId}
							collectionAddress={collectionAddress}
						/>
					</div>
				)}
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
				collectibleId={collectibleId.toString()}
			/>

			<OffersTable
				chainId={chainId}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId.toString()}
			/>

			<ActivitiesTable />
		</div>
	);
}