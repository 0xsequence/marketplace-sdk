import { Button, Text } from '@0xsequence/design-system';
import {
	type ContractType,
	OrderSide,
	type OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollectionBalanceDetails,
	useListCollectibles,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

interface InfiniteScrollViewProps {
	collectionAddress: Hex;
	chainId: string;
	orderbookKind: OrderbookKind;
	collection: ContractInfo | undefined;
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
		data: infiniteData,
		isLoading: infiniteLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useListCollectibles({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: true,
		},
		query: {
			enabled: !!collectionAddress && !!chainId,
		},
	});

	const { data: collectionBalance, isLoading: collectionBalanceLoading } =
		useCollectionBalanceDetails({
			chainId: Number(chainId),
			filter: {
				accountAddresses: accountAddress ? [accountAddress] : [],
				contractWhitelist: [collectionAddress],
				omitNativeBalances: true,
			},
			query: {
				enabled: !!accountAddress,
			},
		});

	const allCollectibles =
		infiniteData?.pages.flatMap((page) => page.collectibles) || [];

	if (allCollectibles.length === 0 && !infiniteLoading) {
		return (
			<div className="flex justify-center">
				<Text variant="large">No collectibles found</Text>
			</div>
		);
	}

	return (
		<>
			<div
				className="grid gap-4"
				style={{
					gridTemplateColumns: 'repeat(3, 1fr)',
				}}
			>
				{allCollectibles.map((collectible) => (
					<div key={collectible.metadata.tokenId}>
						<CollectibleCard
							collectibleId={collectible.metadata.tokenId}
							chainId={chainId}
							collectionAddress={collectionAddress}
							orderbookKind={orderbookKind}
							collectionType={collection?.type as ContractType}
							lowestListing={collectible}
							onCollectibleClick={onCollectibleClick}
							balance={
								collectionBalance?.balances?.find(
									(balance) => balance.tokenID === collectible.metadata.tokenId,
								)?.balance
							}
							cardLoading={
								infiniteLoading || collectionLoading || collectionBalanceLoading
							}
							onCannotPerformAction={(action) => {
								console.log(`Cannot perform action: ${action}`);
							}}
						/>
					</div>
				))}
			</div>

			{hasNextPage && (
				<div className="mt-4 flex justify-center">
					<Button
						variant="secondary"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? 'Loading more...' : 'Load more'}
					</Button>
				</div>
			)}
		</>
	);
}
