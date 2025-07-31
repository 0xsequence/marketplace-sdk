'use client';

import type { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
import type { ComponentProps } from 'react';
import type { Address } from 'viem';
import { VirtualizedCollectiblesView } from './VirtualizedCollectiblesView';

type CollectibleCardProps = ComponentProps<typeof CollectibleCard>;

export interface PaginatedViewProps {
	collectionAddress: Address;
	chainId: number;
	collectibleCards: CollectibleCardProps[];
	renderItemContent: (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => React.ReactNode;
	isLoading?: boolean;
	pageSize?: number;
}

export function PaginatedView({
	collectionAddress,
	chainId,
	collectibleCards,
	renderItemContent,
	isLoading = false,
}: PaginatedViewProps) {
	return (
		<VirtualizedCollectiblesView
			mode="paginated"
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={collectibleCards}
			isLoading={isLoading}
			renderItemContent={renderItemContent}
		/>
	);
}
