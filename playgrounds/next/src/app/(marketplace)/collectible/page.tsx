'use client';

import { ActivitiesTable } from '@/components/ActivitiesTable';
import { CollectibleActions } from '@/components/CollectibleActions';
import { CollectibleDetails } from '@/components/CollectibleDetails';
import { ListingsTable } from '@/components/ListingsTable';
import { OffersTable } from '@/components/OffersTable';
import { usePlayground } from '@/lib/PlaygroundContext';
import { type ContractType, OrderSide } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
	useListCollectibles,
	useLowestListing,
} from '@0xsequence/marketplace-sdk/react';
import { useAccount } from 'wagmi';

export default function CollectiblePage() {
	const { address: accountAddress } = useAccount();
	const {
		collectionAddress,
		chainId,
		collectibleId,
		orderbookKind,
		sdkConfig,
	} = usePlayground();

	// Fetch collectible data
	const { data: collectible, isLoading: collectibleLoading } = useCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});

	// Fetch filtered collectibles
	const { data: filteredCollectibles, isLoading: filteredCollectiblesLoading } =
		useListCollectibles({
			collectionAddress,
			chainId,
			side: OrderSide.listing,
			filter: {
				includeEmpty: true,
				searchText: collectible?.name,
			},
		});

	// Fetch lowest listing
	const { data: lowestListing } = useLowestListing({
		collectionAddress,
		chainId,
		tokenId: collectibleId,
	});

	// Fetch collection data
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	// Fetch user's balance of this collectible
	const { data: balance } = useBalanceOfCollectible({
		collectionAddress,
		chainId,
		collectableId: collectibleId,
		userAddress: accountAddress,
	});

	// Find the filtered collectible
	const filteredCollectible = filteredCollectibles?.pages[0]?.collectibles.find(
		(fc) => fc.metadata.tokenId === collectibleId,
	);

	const balanceString = balance?.balance?.toString();
	const isOwner = !!balance?.balance;

	const isLoading =
		collectibleLoading || filteredCollectiblesLoading || collectionLoading;

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<h2 className="font-semibold text-gray-100 text-xl">Collectible</h2>
				<div className="flex justify-center rounded-xl border border-gray-700/30 bg-gray-800/80 p-6 shadow-lg">
					<p className="text-gray-300">Loading collectible...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-semibold text-gray-100 text-xl">Collectible</h2>

			<div className="flex flex-col gap-6 md:flex-row">
				<div className="w-full md:w-1/3 lg:w-1/4">
					<div className="overflow-hidden rounded-xl">
						<CollectibleCard
							collectibleId={collectibleId}
							chainId={chainId}
							collectionAddress={collectionAddress}
							orderbookKind={orderbookKind}
							collectionType={collection?.type as ContractType}
							lowestListing={filteredCollectible}
							balance={balanceString}
							cardLoading={isLoading}
						/>
					</div>
				</div>

				<div className="flex w-full flex-col gap-6 md:w-2/3 lg:w-3/4">
					<CollectibleDetails
						name={collectible?.name}
						id={collectibleId}
						balance={Number(balance?.balance)}
					/>

					<CollectibleActions
						isOwner={isOwner}
						collectionAddress={collectionAddress}
						chainId={chainId}
						collectibleId={collectibleId}
						orderbookKind={orderbookKind}
						lowestListing={lowestListing?.order}
					/>
				</div>
			</div>

			<ListingsTable contractType={collection?.type as ContractType} />
			<OffersTable contractType={collection?.type as ContractType} />
			<ActivitiesTable />
		</div>
	);
}
