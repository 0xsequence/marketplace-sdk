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
import {
	Actions,
	ActivitiesTable,
	CollectibleDetails,
	ListingsTable,
	OffersTable,
} from '../components/collectible';
import { useMarketplace } from '../lib/MarketplaceContext';

export function Collectible() {
	const context = useMarketplace();
	const { address: accountAddress } = useAccount();
	const { collectionAddress, chainId, collectibleId } = context;
	const { data: collectible, isLoading: collectibleLoading } = useCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});
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
	const { data: lowestListing } = useLowestListing({
		collectionAddress,
		chainId,
		tokenId: collectibleId,
	});
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});
	const { data: balance } = useBalanceOfCollectible({
		collectionAddress,
		chainId,
		collectableId: collectibleId,
		userAddress: accountAddress,
	});

	const filteredCollectible = filteredCollectibles?.pages[0].collectibles.find(
		(fc) => fc.metadata.tokenId === collectibleId,
	);
	const balanceString = balance?.balance?.toString();

	return (
		<div className="flex pt-3 gap-3 flex-col">
			<div className="flex gap-3">
				<div>
					<CollectibleCard
						collectibleId={collectibleId}
						chainId={chainId}
						collectionAddress={collectionAddress}
						orderbookKind={context.orderbookKind}
						collectionType={collection?.type as ContractType}
						lowestListing={filteredCollectible}
						onOfferClick={({ order }) => console.log(order)}
						balance={balanceString}
						cardLoading={
							collectibleLoading ||
							filteredCollectiblesLoading ||
							collectionLoading
						}
					/>
				</div>

				<CollectibleDetails
					name={collectible?.name}
					id={collectibleId.toString()}
					balance={Number(balance?.balance)}
				/>
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
