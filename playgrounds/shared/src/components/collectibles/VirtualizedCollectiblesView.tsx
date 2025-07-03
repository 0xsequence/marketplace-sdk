'use client';

import { Button, Text } from '@0xsequence/design-system';
import type { ContractType, OrderbookKind } from '@0xsequence/marketplace-sdk';
import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef, useState } from 'react';
import type { Address } from 'viem';
import { useInfiniteCollectibles } from '../../hooks/useInfiniteCollectibles';
import { usePaginatedCollectibles } from '../../hooks/usePaginatedCollectibles';
import { FiltersSidebar } from '../filters';

export interface VirtualizedCollectiblesViewProps {
	mode: 'infinite' | 'paginated';
	collectionAddress: Address;
	chainId: number;
	renderItemContent: (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => React.ReactNode;

	// Props for infinite mode
	orderbookKind?: OrderbookKind;
	collectionType?: ContractType;
	onCollectibleClick?: (tokenId: string) => void;

	// Props for paginated mode
	collectibleCards?: CollectibleCardProps[];
	isLoading?: boolean;
	pageSize?: number;
}

export function VirtualizedCollectiblesView({
	mode,
	collectionAddress,
	chainId,
	renderItemContent,
	orderbookKind,
	collectionType,
	onCollectibleClick,
	collectibleCards: externalCollectibleCards = [],
	isLoading: externalIsLoading = false,
	pageSize = 6,
}: VirtualizedCollectiblesViewProps) {
	const parentRef = useRef<HTMLDivElement>(null);
	const [columns, setColumns] = useState(3);

	// Responsive column calculation
	useEffect(() => {
		const updateColumns = () => {
			const width = window.innerWidth;
			if (width < 640) {
				setColumns(2); // Mobile: 2 columns
			} else if (width < 1024) {
				setColumns(2); // Small: 2 columns
			} else {
				setColumns(3); // Large: 3 columns
			}
		};

		updateColumns();
		window.addEventListener('resize', updateColumns);
		return () => window.removeEventListener('resize', updateColumns);
	}, []);

	// Data fetching based on mode
	const infiniteQuery = useInfiniteCollectibles({
		collectionAddress,
		chainId,
		orderbookKind: orderbookKind!,
		collectionType: collectionType!,
		onCollectibleClick: onCollectibleClick!,
		showFilters: true,
	});

	const paginatedQuery = usePaginatedCollectibles({
		collectibleCards: externalCollectibleCards,
		isLoading: externalIsLoading,
		pageSize,
	});

	// Use appropriate data based on mode
	const data = mode === 'infinite' ? infiniteQuery : paginatedQuery;
	const items =
		mode === 'infinite'
			? infiniteQuery.collectibleCards
			: paginatedQuery.paginatedCards;

	// Calculate grid dimensions
	const itemHeight = 306; // Approximate item height
	const gap = 16; // Gap between items
	const rows = Math.ceil(items.length / columns);

	// Create virtualizer
	const virtualizer = useWindowVirtualizer({
		count: rows,
		getScrollElement: () => window,
		estimateSize: () => itemHeight + gap,
		overscan: 2,
	});

	const handleLoadMore = () => {
		if (
			mode === 'infinite' &&
			infiniteQuery.hasNextPage &&
			!infiniteQuery.isFetchingNextPage
		) {
			infiniteQuery.fetchNextPage?.();
		}
	};

	// Handle empty state
	if (items.length === 0 && !data.isLoading) {
		return (
			<div className="flex w-full gap-1">
				<FiltersSidebar
					chainId={chainId}
					collectionAddress={collectionAddress}
				/>
				<div className="flex h-full w-full flex-col items-center justify-center gap-4">
					<Text variant="large">No collectibles found</Text>
				</div>
			</div>
		);
	}

	const content = (
		<div className="w-full">
			<div ref={parentRef} className="w-full overflow-auto">
				<div
					style={{
						height: `${virtualizer.getTotalSize()}px`,
						width: '100%',
						position: 'relative',
					}}
				>
					{virtualizer.getVirtualItems().map((virtualRow) => {
						const rowIndex = virtualRow.index;
						const startIndex = rowIndex * columns;
						const rowItems = items.slice(startIndex, startIndex + columns);

						return (
							<div
								key={virtualRow.key}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<div
									className="grid gap-4"
									style={{
										gridTemplateColumns: `repeat(${columns}, 1fr)`,
									}}
								>
									{rowItems.map((item, colIndex) => {
										const itemIndex = startIndex + colIndex;
										return (
											<div key={itemIndex}>
												{renderItemContent(itemIndex, item)}
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Loading indicator for infinite scroll */}
			{mode === 'infinite' && infiniteQuery.hasNextPage && (
				<div className="flex justify-center py-4">
					{infiniteQuery.isFetchingNextPage ? (
						<Text>Loading more collectibles...</Text>
					) : (
						<Button onClick={handleLoadMore}>Load More</Button>
					)}
				</div>
			)}

			{/* Pagination controls for paginated mode */}
			{mode === 'paginated' && paginatedQuery.totalPages > 1 && (
				<div className="mt-4 flex justify-center gap-2">
					<Button
						className="bg-gray-900 text-gray-300"
						onClick={() =>
							paginatedQuery.setCurrentPage(
								Math.max(1, paginatedQuery.currentPage - 1),
							)
						}
						disabled={paginatedQuery.currentPage <= 1}
					>
						Previous
					</Button>
					<Text className="mx-2 flex items-center font-bold text-gray-300 text-sm">
						Page {paginatedQuery.currentPage} of {paginatedQuery.totalPages}
					</Text>
					<Button
						className="bg-gray-900 text-gray-300"
						onClick={() =>
							paginatedQuery.setCurrentPage(paginatedQuery.currentPage + 1)
						}
						disabled={paginatedQuery.currentPage >= paginatedQuery.totalPages}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);

	return (
		<div className="flex w-full gap-1">
			<FiltersSidebar chainId={chainId} collectionAddress={collectionAddress} />
			{content}
		</div>
	);
}
