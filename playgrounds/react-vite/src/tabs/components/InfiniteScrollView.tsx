import { Text, useToast } from '@0xsequence/design-system2';
import { OrderSide, type OrderbookKind } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollectionBalanceDetails,
	useListCollectibles,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo, ContractType } from '@0xsequence/metadata';
import React from 'react';
import { useAccount } from 'wagmi';
import { CollectibleCardAction } from '../../../../../packages/sdk/src/react/ui/components/_internals/action-button/types';
interface InfiniteScrollViewProps {
	collectionAddress: `0x${string}`;
	chainId: string;
	orderbookKind: OrderbookKind;
	collection: ContractInfo;
	collectionLoading: boolean;
	onCollectibleClick: (tokenId: string) => void;
}

export function InfiniteScrollView({
	collectionAddress,
	chainId,
	orderbookKind,
	collection,
	collectionLoading,
	onCollectibleClick,
}: InfiniteScrollViewProps) {
	const { address: accountAddress } = useAccount();
	const {
		data: collectiblesWithListings,
		isLoading: collectiblesWithListingsLoading,
	} = useListCollectibles({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: true,
		},
	});

	const { data: collectionBalance, isLoading: collectionBalanceLoading } =
		useCollectionBalanceDetails({
			chainId: Number(chainId),
			filter: {
				accountAddresses: accountAddress ? [accountAddress] : [],
				omitNativeBalances: true,
				contractWhitelist: [collectionAddress],
			},
			query: {
				enabled: !!accountAddress,
			},
		});

	const toast = useToast();

	if (
		!collectiblesWithListings?.pages.length &&
		!collectiblesWithListingsLoading
	) {
		return (
			<div className="flex pt-3 justify-center">
				<Text variant="large">No collectibles found</Text>
			</div>
		);
	}

	return (
		<div
			className="grid gap-3 pt-3 items-start"
			style={{
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '16px',
			}}
		>
			{collectiblesWithListingsLoading ? (
				<div className="flex justify-center py-8 col-span-3">
					<Text>Loading collectibles...</Text>
				</div>
			) : (
				collectiblesWithListings?.pages.map((group, i) => (
					<React.Fragment key={group.collectibles[0]?.metadata.tokenId || i}>
						{group.collectibles.map((collectibleLowestListing) => (
							<CollectibleCard
								key={collectibleLowestListing.metadata.tokenId}
								collectibleId={collectibleLowestListing.metadata.tokenId}
								chainId={chainId}
								collectionAddress={collectionAddress}
								orderbookKind={orderbookKind}
								collectionType={collection?.type as ContractType}
								lowestListing={collectibleLowestListing}
								onCollectibleClick={onCollectibleClick}
								onOfferClick={({ order }) => console.log(order)}
								balance={
									collectionBalance?.balances.find(
										(balance) =>
											balance.tokenID ===
											collectibleLowestListing.metadata.tokenId,
									)?.balance
								}
								cardLoading={
									collectiblesWithListingsLoading ||
									collectionLoading ||
									collectionBalanceLoading
								}
								onCannotPerformAction={(action) => {
									const label =
										action === CollectibleCardAction.BUY
											? 'buy'
											: 'make offer for';
									toast({
										title: `You cannot ${label} this collectible`,
										description: `You can only ${label} collectibles you do not own`,
										variant: 'error',
									});
								}}
							/>
						))}
					</React.Fragment>
				))
			)}
		</div>
	);
}
