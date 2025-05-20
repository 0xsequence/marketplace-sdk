import { Text } from '@0xsequence/design-system';
import type { CollectibleOrder } from '@0xsequence/marketplace-sdk';
import type { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
import type {
	FetchNextPageOptions,
	InfiniteData,
	InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { ComponentProps } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { FiltersSidebar } from 'shared-components';
import type { ListCollectiblesReturn } from '../../../../../sdk/src/react/_internal';
import { GridContainer } from './GridContainer';

type CollectibleCardProps = ComponentProps<typeof CollectibleCard>;

interface InfiniteScrollViewProps {
	collectionAddress: `0x${string}`;
	chainId: number;
	collectibleCards: CollectibleCardProps[];
	collectiblesLoading?: boolean;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	fetchNextPage?: (
		options?: FetchNextPageOptions,
	) => Promise<
		InfiniteQueryObserverResult<
			InfiniteData<ListCollectiblesReturn, unknown>,
			Error
		>
	>;
	allCollectibles?: CollectibleOrder[];
	renderItemContent: (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => React.ReactNode;
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
}: InfiniteScrollViewProps) {
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

	useEffect(() => {
		setIsFetchingNextPage(isFetchingNextPage);
	}, [isFetchingNextPage]);

	if (allCollectibles && allCollectibles.length === 0 && !collectiblesLoading) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">No collectibles found</Text>
			</div>
		);
	}

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
