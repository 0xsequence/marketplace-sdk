import { Text } from '@0xsequence/design-system';
import type { ContractType, OrderbookKind } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useFilterState,
	useListMarketCardData,
} from '@0xsequence/marketplace-sdk/react';
import { useEffect, useState } from 'react';
import type { ComponentProps } from 'react';
import { Link } from 'react-router';
import { VirtuosoGrid } from 'react-virtuoso';
import { FiltersSidebar } from 'shared-components';
import { GridContainer } from './GridContainer';

type CollectibleCardProps = ComponentProps<typeof CollectibleCard>;

interface InfiniteScrollViewProps {
	collectionAddress: `0x${string}`;
	chainId: number;
	orderbookKind: OrderbookKind;
	collectionType: ContractType;
	collectionLoading: boolean;
	onCollectibleClick: (tokenId: string) => void;
}

export function InfiniteScrollView({
	collectionAddress,
	chainId,
	orderbookKind,
	collectionType,
	collectionLoading,
	onCollectibleClick,
}: InfiniteScrollViewProps) {
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
	const { filterOptions } = useFilterState();

	const {
		collectibleCards,
		isLoading: collectiblesLoading,
		hasNextPage,
		isFetchingNextPage: isSDKFetchingNextPage,
		fetchNextPage,
		allCollectibles,
	} = useListMarketCardData({
		collectionAddress,
		chainId,
		orderbookKind,
		collectionType,
		filterOptions,
		onCollectibleClick,
	});

	// Update the isFetchingNextPage state when the SDK's isFetchingNextPage changes
	useEffect(() => {
		setIsFetchingNextPage(isSDKFetchingNextPage);
	}, [isSDKFetchingNextPage]);

	if (allCollectibles.length === 0 && !collectiblesLoading) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">No collectibles found</Text>
			</div>
		);
	}

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
			setIsFetchingNextPage(true);
			fetchNextPage().finally(() => {
				setIsFetchingNextPage(false);
			});
		}
	};

	const renderItemContent = (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => {
		if (collectionLoading) {
			return (
				<div className="flex w-full min-w-[175px] items-stretch justify-center">
					<Text>Loading...</Text>
				</div>
			);
		}

		return (
			<div
				key={index}
				className="flex w-full min-w-[175px] items-stretch justify-center"
			>
				<Link to={'/collectible'} key={collectibleCard.collectibleId}>
					<CollectibleCard {...collectibleCard} />
				</Link>
			</div>
		);
	};

	const FooterComponent = () => {
		if (!hasNextPage) return null;

		return (
			<div className="col-span-full flex justify-center py-4">
				{isFetchingNextPage ? (
					<Text>Loading more collectibles...</Text>
				) : (
					<Text className="text-muted">Scroll to load more</Text>
				)}
			</div>
		);
	};

	return (
		<div className="flex w-full gap-1">
			<FiltersSidebar chainId={chainId} collectionAddress={collectionAddress} />

			<VirtuosoGrid
				useWindowScroll
				components={{
					List: GridContainer,
					Footer: FooterComponent,
				}}
				itemContent={renderItemContent}
				endReached={handleEndReached}
				overscan={500}
				data={collectibleCards}
				listClassName="grid-container"
				style={{ height: '100%', width: '100%' }}
			/>
		</div>
	);
}
