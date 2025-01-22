import { Box, Text } from '@0xsequence/design-system';
import { type ContractType, OrderbookKind, OrderSide } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useBalanceOfCollectible,
	useCollectible,
	useCollection,
	useListCollectibles,
} from '@0xsequence/marketplace-sdk/react';
import { useAccount } from 'wagmi';
import { useMarketplace } from '../lib/MarketplaceContext';
import {
	Actions,
	ActivitiesTable,
	CollectibleDetails,
	ListingsTable,
	OffersTable,
} from '../components/collectible';

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
		<Box paddingTop="3" gap="3" flexDirection="column">
			<Box gap="3">
				<Box>
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
				</Box>

				<CollectibleDetails
					name={collectible?.name}
					id={collectibleId.toString()}
					balance={Number(balance?.balance)}
				/>
			</Box>

			<Actions
				isOwner={!!balance?.balance}
				collectionAddress={collectionAddress}
				chainId={chainId}
				collectibleId={collectibleId}
				orderbookKind={context.orderbookKind || OrderbookKind.sequence_marketplace_v2}
			/>

			<ListingsTable />
			<OffersTable />

			<Box width='full' position="sticky" top="0" background='backgroundPrimary' paddingY='1' zIndex='10'>
			<Text fontFamily="body" color="text100" fontSize="medium" fontWeight="bold">
				Activities History
				</Text>
			</Box>

			<ActivitiesTable />
		</Box>
	);
}
