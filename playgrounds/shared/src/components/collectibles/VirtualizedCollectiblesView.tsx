'use client';

import { Button, Text } from '@0xsequence/design-system';
import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import { useEffect, useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import type { Address } from 'viem';
import { FiltersSidebar } from '../filters';

export interface VirtualizedCollectiblesViewProps {
	mode: 'infinite' | 'paginated';
	collectionAddress: Address;
	chainId: number;
	renderItemContent: (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => React.ReactNode;
	collectibleCards: CollectibleCardProps[];
	isLoading: boolean;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	fetchNextPage?: () => Promise<unknown>;
}

export function VirtualizedCollectiblesView({
	mode,
	collectionAddress,
	chainId,
	renderItemContent,
	collectibleCards,
	isLoading,
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
}: VirtualizedCollectiblesViewProps) {
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

	const handleLoadMore = () => {
		if (mode === 'infinite' && hasNextPage && !isFetchingNextPage) {
			fetchNextPage?.();
		}
	};

	// Handle empty state
	if (collectibleCards.length === 0 && (isLoading || isFetchingNextPage)) {
		return (
			<div className="flex w-full gap-1">
				<FiltersSidebar
					chainId={chainId}
					collectionAddress={collectionAddress}
				/>
				<div className="flex h-full w-full flex-col items-center justify-center gap-4">
					<Text variant="large">Loading collectibles...</Text>
				</div>
			</div>
		);
	}

	if (collectibleCards.length === 0 && !isLoading) {
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

	const gridComponents = {
		List: ({ children, style, ...props }: any) => (
			<div
				{...props}
				style={{
					...style,
					display: 'grid',
					gridTemplateColumns: `repeat(${columns}, 1fr)`,
					gap: '1rem',
					paddingLeft: '1rem',
					paddingRight: '1rem',
					paddingBottom: '1rem',
				}}
			>
				{children}
			</div>
		),
		Item: ({ children, ...props }: any) => (
			<div {...props} style={{ width: '100%' }}>
				{children}
			</div>
		),
		Footer: () => {
			if (mode === 'infinite' && hasNextPage) {
				return (
					<div className="flex justify-center py-4">
						{isFetchingNextPage ? (
							<Text>Loading more collectibles...</Text>
						) : (
							<Button onClick={handleLoadMore}>Load More</Button>
						)}
					</div>
				);
			}
			return null;
		},
	};

	return (
		<div className="flex w-full gap-1">
			<FiltersSidebar chainId={chainId} collectionAddress={collectionAddress} />
			<div className="w-full">
				<VirtuosoGrid
					totalCount={collectibleCards.length}
					components={gridComponents}
					itemContent={(index) =>
						renderItemContent(index, collectibleCards[index])
					}
					useWindowScroll
					endReached={handleLoadMore}
					overscan={200}
					isScrolling={() => isLoading}
				/>
			</div>
		</div>
	);
}
