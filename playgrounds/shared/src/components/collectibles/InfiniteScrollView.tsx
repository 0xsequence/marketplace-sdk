'use client';

import type { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
import type { ComponentProps } from 'react';
import type { Address } from 'viem';
import { VirtualizedCollectiblesView } from './VirtualizedCollectiblesView';

type CollectibleCardProps = ComponentProps<typeof CollectibleCard>;

export interface InfiniteScrollViewProps {
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

export function InfiniteScrollView(props: InfiniteScrollViewProps) {
	return <VirtualizedCollectiblesView {...props} mode="infinite" />;
}
