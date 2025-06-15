'use client';

import { CollectibleDetails } from '@/components/CollectibleDetails';
import {
	Media,
	useBalanceOfCollectible,
	useCollectible,
	useLowestListing,
} from '@0xsequence/marketplace-sdk/react';
import { Actions, ActivitiesTable, useMarketplace } from 'shared-components';
import ListingsTable from 'shared-components/src/components/ordersTable/ListingsTable';
import OffersTable from 'shared-components/src/components/ordersTable/OffersTable';
import { useAccount } from 'wagmi';

export default function CollectiblePage() {
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

	return (
		<div className="flex flex-col gap-3 pt-3">
			<div className="flex gap-3">
				<Media
					name={collectible?.name}
					assets={[
						collectible?.video,
						collectible?.animation_url,
						collectible?.image,
					]}
					className="h-[168px] w-[168px] overflow-hidden rounded-xl"
				/>

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
				lowestListing={lowestListing}
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
