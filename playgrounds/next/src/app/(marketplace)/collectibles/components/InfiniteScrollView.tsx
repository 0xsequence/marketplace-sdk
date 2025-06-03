import { Button, Text } from '@0xsequence/design-system';
import type { ContractType, OrderbookKind } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useFilterState,
	useListMarketCardData,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import Link from 'next/link';
import type { Hex } from 'viem';

interface InfiniteScrollViewProps {
	collectionAddress: Hex;
	chainId: number;
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
	onCollectibleClick,
}: InfiniteScrollViewProps) {
	const { filterOptions } = useFilterState();

	const {
		collectibleCards,
		isLoading: collectiblesLoading,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		allCollectibles,
	} = useListMarketCardData({
		collectionAddress,
		chainId,
		orderbookKind,
		collectionType: collection?.type as ContractType,
		filterOptions,
		onCollectibleClick,
	});

	if (allCollectibles.length === 0 && !collectiblesLoading) {
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
				{collectibleCards.map((collectibleCard) => (
					<div key={collectibleCard.collectibleId}>
						<Link
							href={'/collectible'}
							onClick={(e) => {
								e.preventDefault();
							}}
						>
							<CollectibleCard {...collectibleCard} />
						</Link>
					</div>
				))}
			</div>

			{hasNextPage && (
				<div className="mt-4 flex justify-center">
					<Button
						variant="base"
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
