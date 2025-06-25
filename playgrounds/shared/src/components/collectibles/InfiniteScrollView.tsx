'use client';

import type { ContractType, OrderbookKind } from '@0xsequence/marketplace-sdk';
import type { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
import type { ComponentProps } from 'react';
import type { Address } from 'viem';
import { VirtualizedCollectiblesView } from './VirtualizedCollectiblesView';

type CollectibleCardProps = ComponentProps<typeof CollectibleCard>;

export interface InfiniteScrollViewProps {
	collectionAddress: Address;
	chainId: number;
	orderbookKind: OrderbookKind;
	collectionType: ContractType;
	onCollectibleClick: (tokenId: string) => void;
	renderItemContent: (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => React.ReactNode;
}

export function InfiniteScrollView(props: InfiniteScrollViewProps) {
	return <VirtualizedCollectiblesView {...props} mode="infinite" />;
}
