'use client';

import { CollectibleDetails } from '@/components/CollectibleDetails';
import { type ContractType, OrderSide } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
	useListCollectibles,
	useLowestListing,
} from '@0xsequence/marketplace-sdk/react';
import {
	Actions,
	ActivitiesTable,
	ListingsTable,
	OffersTable,
	useMarketplace,
} from 'shared-components';
import { useAccount } from 'wagmi';

export default function CollectiblePage() {
	const context = useMarketplace();
	const { address: accountAddress } = useAccount();
	const { collectionAddress, chainId, collectibleId } = context;

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
	const isLoading =
		collectibleLoading || filteredCollectiblesLoading || collectionLoading;

	return (
		<div className="flex flex-col gap-3 pt-3">
			<div className="flex gap-3">
				<div className="flex items-center">
					<CollectibleCard
						collectibleId={collectibleId}
						chainId={chainId}
						collectionAddress={collectionAddress}
						orderbookKind={context.orderbookKind}
						collectionType={collection?.type as ContractType}
						lowestListing={filteredCollectible}
						onOfferClick={({ order }) => console.log(order)}
						balance={balanceString}
						cardLoading={isLoading}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<CollectibleDetails
						name={collectible?.name}
						id={collectibleId.toString()}
						balance={Number(balance?.balance)}
					/>
				</div>
			</div>

			<Actions
				isOwner={!!balance?.balance}
				collectionAddress={collectionAddress}
				chainId={chainId}
				collectibleId={collectibleId}
				orderbookKind={context.orderbookKind}
				lowestListing={lowestListing?.order}
			/>

			<ListingsTable contractType={collection?.type as ContractType} />
			<OffersTable contractType={collection?.type as ContractType} />
			<ActivitiesTable />
		</div>
	);
}
