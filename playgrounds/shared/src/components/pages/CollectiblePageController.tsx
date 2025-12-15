'use client';

import { Skeleton } from '@0xsequence/design-system';
import type { ContractType } from '@0xsequence/marketplace-sdk';
import {
	Media,
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
	useLowestListing,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { useMarketplace } from '../../store';
import { Actions } from '../collectible/actions/Actions';
import { CollectibleDetails } from '../collectible/CollectibleDetails';
import ListingsTable from '../ordersTable/ListingsTable';
import OffersTable from '../ordersTable/OffersTable';

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
	onCollectionClick: () => void;
	chainId: number;
	collectionAddress: Address;
	tokenId: bigint;
}

export function CollectiblePageController({
	className,
	mediaClassName,
	showFullLayout = true,
	onCollectionClick,
	chainId,
	collectionAddress,
	tokenId,
}: CollectiblePageControllerProps) {
	const { cardType } = useMarketplace();
	const { address: accountAddress } = useAccount();
	const isShop = cardType === 'shop';

	const { data: collection } = useCollection({
		collectionAddress,
		chainId,
	});

	const { data: collectible, isLoading: isCollectibleLoading } = useCollectible(
		{
			collectionAddress,
			chainId,
			tokenId,
		},
	);

	const { data: lowestListing } = useLowestListing({
		collectionAddress,
		chainId,
		tokenId,
		query: {
			enabled: !isShop,
		},
	});

	const { data: balance } = useBalanceOfCollectible({
		collectionAddress,
		chainId,
		tokenId,
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
	const mediaSize = showFullLayout
		? 'h-[300px] w-[300px]'
		: 'h-[168px] w-[168px]';
	const finalMediaClassName =
		mediaClassName || `${mediaSize} overflow-hidden rounded-xl flex-1`;

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
						id={tokenId}
						balance={Number(balance?.balance)}
						chainId={chainId}
						collection={collection}
						onCollectionClick={onCollectionClick}
					/>
				) : (
					<div className="flex flex-col gap-1">
						<CollectibleDetails
							name={collectible?.name}
							id={tokenId}
							balance={Number(balance?.balance)}
							chainId={chainId}
							collection={collection}
							onCollectionClick={onCollectionClick}
						/>
					</div>
				)}
			</div>

			<Actions
				isOwner={!!balance?.balance}
				collectionAddress={collectionAddress}
				chainId={chainId}
				tokenId={tokenId}
				lowestListing={lowestListing || undefined}
				contractType={collection?.type as ContractType}
				collectibleName={collectible?.name ?? ''}
			/>

			{!isShop && (
				<ListingsTable
					chainId={chainId}
					collectionAddress={collectionAddress}
					tokenId={tokenId}
				/>
			)}

			{!isShop && (
				<OffersTable
					chainId={chainId}
					collectionAddress={collectionAddress}
					tokenId={tokenId}
				/>
			)}
		</div>
	);
}
