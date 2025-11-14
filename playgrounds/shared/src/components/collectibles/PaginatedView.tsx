'use client';

import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import { useEffect, useMemo } from 'react';
import type { Address } from 'viem';
import {
	ItemsPerPageSelect,
	PreviousNextPageControls,
} from '../Table/controls';
import { VirtualizedCollectiblesView } from './VirtualizedCollectiblesView';

export interface PaginatedViewProps {
	collectionAddress: Address;
	chainId: number;
	collectibleCards: CollectibleCardProps[];
	renderItemContent: (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => React.ReactNode;
	isLoading?: boolean;
	isFetchingNextPage?: boolean;
	page: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	hasMore?: boolean;
	fetchNextPage?: () => void;
	allCollectibles?: CollectibleCardProps[];
}

export function PaginatedView({
	collectionAddress,
	chainId,
	collectibleCards,
	renderItemContent,
	isLoading = false,
	isFetchingNextPage = false,
	page,
	pageSize,
	onPageChange,
	onPageSizeChange,
	hasMore,
	fetchNextPage,
	allCollectibles,
}: PaginatedViewProps) {
	const visibleCards = useMemo(() => {
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		return collectibleCards.slice(start, end);
	}, [collectibleCards, page, pageSize]);

	useEffect(() => {
		const required = page * pageSize;
		if (
			allCollectibles &&
			allCollectibles.length < required &&
			hasMore &&
			!isFetchingNextPage &&
			fetchNextPage
		) {
			void fetchNextPage();
		}
	}, [
		page,
		pageSize,
		allCollectibles,
		hasMore,
		isFetchingNextPage,
		fetchNextPage,
	]);

	const collectiblesLoading =
		isLoading ||
		(visibleCards.length === 0 && (isFetchingNextPage || !!hasMore));

	return (
		<div className="flex w-full flex-col gap-3">
			<div className="flex items-center justify-end gap-3 px-4">
				<ItemsPerPageSelect
					pageSize={pageSize}
					onPageSizeChange={(size) => {
						onPageSizeChange(size);
						// Reset to first page when page size changes
						onPageChange(1);
					}}
				/>
				<PreviousNextPageControls
					page={page}
					onPageChange={onPageChange}
					// We don't know total pages; rely on hasMore to enable Next
					totalPages={Number.MAX_SAFE_INTEGER}
					hasMore={hasMore}
				/>
			</div>

			<VirtualizedCollectiblesView
				mode="paginated"
				collectionAddress={collectionAddress}
				chainId={chainId}
				collectibleCards={visibleCards}
				isLoading={collectiblesLoading}
				isFetchingNextPage={isFetchingNextPage}
				renderItemContent={renderItemContent}
			/>
		</div>
	);
}
