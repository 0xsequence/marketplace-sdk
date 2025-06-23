'use client';

import { Text } from '@0xsequence/design-system';
import type { CollectibleOrder } from '@0xsequence/marketplace-sdk';
import type { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
import type { FetchNextPageOptions } from '@tanstack/react-query';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { FiltersSidebar } from '../filters';
// Note: These types are used for the fetchNextPage function signature but are available from the SDK
import { GridContainer } from './GridContainer';

type CollectibleCardProps = ComponentProps<typeof CollectibleCard>;

export interface InfiniteScrollViewProps {
	collectionAddress: `0x${string}`;
	chainId: number;
	collectibleCards: CollectibleCardProps[];
	collectiblesLoading?: boolean;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	fetchNextPage?: (options?: FetchNextPageOptions) => Promise<any>;
	allCollectibles?: CollectibleOrder[];
	renderItemContent: (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => React.ReactNode;
	showFilters?: boolean;
}

export function InfiniteScrollView({
	collectionAddress,
	chainId,
	collectibleCards,
	collectiblesLoading,
	hasNextPage,
	fetchNextPage,
	allCollectibles,
	renderItemContent,
	showFilters = true,
}: InfiniteScrollViewProps) {
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

	useEffect(() => {
		setIsFetchingNextPage(isFetchingNextPage);
	}, [isFetchingNextPage]);

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
			setIsFetchingNextPage(true);
			fetchNextPage()?.finally(() => {
				setIsFetchingNextPage(false);
			});
		}
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

	const content = (
		<div className="w-full">
			{allCollectibles &&
			allCollectibles.length === 0 &&
			!collectiblesLoading ? (
				<div className="flex h-full w-full flex-col items-center justify-center gap-4">
					<Text variant="large">No collectibles found</Text>
				</div>
			) : (
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
			)}
		</div>
	);

	if (!showFilters) {
		return content;
	}

	return (
		<div className="flex w-full gap-1">
			<FiltersSidebar chainId={chainId} collectionAddress={collectionAddress} />
			{content}
		</div>
	);
}
