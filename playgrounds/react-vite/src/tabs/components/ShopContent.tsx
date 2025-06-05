import { Text } from '@0xsequence/design-system';
import {
	useCollection,
	useList721ShopCardData,
	useList1155ShopCardData,
} from '@0xsequence/marketplace-sdk/react';
import { ContractType } from '../../../../../sdk/src';
import type { CollectibleCardProps } from '../../../../../sdk/src/react/ui/components/marketplace-collectible-card';
import type { ShopContentProps } from '../types';
import { CollectibleCardRenderer } from './CollectibleCardRenderer';
import { InfiniteScrollView } from './InfiniteScrollView';
import { PaginatedView } from './PaginatedView';

export function ShopContent({
	saleContractAddress,
	saleItemIds,
	collectionAddress,
	chainId,
	paginationMode,
}: ShopContentProps) {
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	const is1155 = collection?.type === ContractType.ERC1155;
	const is721 = collection?.type === ContractType.ERC721;

	const hook1155Result = useList1155ShopCardData({
		contractAddress: collectionAddress,
		chainId,
		tokenIds: saleItemIds,
		salesContractAddress: saleContractAddress,
		enabled: is1155,
	});

	const hook721Result = useList721ShopCardData({
		contractAddress: collectionAddress,
		chainId,
		tokenIds: saleItemIds,
		salesContractAddress: saleContractAddress,
		enabled: is721,
	});

	const hookResult = is1155
		? hook1155Result
		: is721
			? hook721Result
			: { collectibleCards: [] };
	const { collectibleCards } = hookResult;

	const isLoading =
		collectionLoading ||
		(is1155
			? hook1155Result.isLoading
			: is721
				? hook721Result.isLoading
				: false);

	const renderItemContent = (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => (
		<CollectibleCardRenderer
			index={index}
			collectibleCard={collectibleCard}
			isLoading={isLoading}
		/>
	);

	if (!saleContractAddress || !saleItemIds) {
		return <div>No sale contract address or item ids found</div>;
	}

	if (collectionLoading) {
		return (
			<div className="flex justify-center">
				<Text>Loading collection...</Text>
			</div>
		);
	}

	if (!collection) {
		return (
			<div className="flex justify-center">
				<Text>Collection not found</Text>
			</div>
		);
	}

	if (!is1155 && !is721) {
		return (
			<div className="flex justify-center">
				<Text>Unsupported collection type</Text>
			</div>
		);
	}

	return paginationMode === 'paginated' ? (
		<PaginatedView
			collectibleCards={collectibleCards}
			renderItemContent={renderItemContent}
			isLoading={isLoading}
		/>
	) : (
		<InfiniteScrollView
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={collectibleCards}
			renderItemContent={renderItemContent}
		/>
	);
}
