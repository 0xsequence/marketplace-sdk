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

export function Collectible() {
	const context = useMarketplace();
	const { address: accountAddress } = useAccount();
	const { collectionAddress, chainId, collectibleId } = context;
	const { data: collectible } = useCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});
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
				/>

				<CollectibleDetails
					name={collectible.name}
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
