import type { ContractInfo } from '@0xsequence/metadata';
import type { Address } from 'viem';
import type { OrderbookKind } from '../../../sdk/src';
import type { CollectibleCardProps } from '../../../sdk/src/react/ui/components/marketplace-collectible-card';

export type Tab = 'collections' | 'collectibles' | 'collectible' | 'debug';
export type PaginationMode = 'infinite' | 'paginated';
export type WalletType = 'universal' | 'embedded' | 'ecosystem';

export interface ContentViewProps {
	collectionAddress: string;
	chainId: number;
	collectibleCards: CollectibleCardProps[];
	collectiblesLoading: boolean;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	fetchNextPage: (() => void) | null;
	renderItemContent: (
		index: number,
		card: CollectibleCardProps,
	) => React.ReactNode;
	// biome-ignore lint/suspicious/noExplicitAny: flexible collectibles data structure for various use cases
	allCollectibles?: any;
}

export interface MarketViewProps {
	collectionAddress: string;
	chainId: number;
	orderbookKind: OrderbookKind;
	collection: ContractInfo;
	collectionLoading: boolean;
	onCollectibleClick: (tokenId: string) => void;
}

export interface ShopContentProps {
	saleContractAddress: Address;
	saleItemIds: string[];
	collectionAddress: Address;
	chainId: number;
	paginationMode: 'paginated' | 'infinite';
}
