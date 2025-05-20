import { Text } from '@0xsequence/design-system';
import {
	CollectibleCard,
	useCollection,
	useList721ShopCardData,
	useList1155ShopCardData,
	useListMarketCardData,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import { Link, useNavigate } from 'react-router';
import { ContractType, type OrderbookKind } from '../../../../sdk/src';

import { FilterBadges, useMarketplace } from 'shared-components';
import type { Address } from 'viem';
import type { CollectibleCardProps } from '../../../../sdk/src/react/ui/components/marketplace-collectible-card';
import { ROUTES } from '../lib/routes';
import { InfiniteScrollView } from './components/InfiniteScrollView';
import { PaginatedView } from './components/PaginatedView';

export function Collectibles() {
	const { chainId, paginationMode, marketplaceType, collectionAddress } =
		useMarketplace();
	const { data: collection } = useCollection({
		collectionAddress,
		chainId,
	});
	const collectionType = collection?.type;

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">Market</Text>

				<Text variant="small" color="text80">
					Mode:{' '}
					{paginationMode === 'paginated' ? 'Paginated' : 'Infinite Scroll'}
				</Text>
			</div>

			<FilterBadges />

			{marketplaceType === 'market' && <MarketContent />}
			{marketplaceType === 'shop' &&
				collectionType === ContractType.ERC1155 && <ShopContent1155 />}
			{marketplaceType === 'shop' && collectionType === ContractType.ERC721 && (
				<ShopContent721 />
			)}
		</div>
	);
}

function MarketContent() {
	const navigate = useNavigate();
	const {
		collectionAddress,
		chainId,
		setCollectibleId,
		orderbookKind,
		paginationMode,
	} = useMarketplace();
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});
	const {
		collectibleCards,
		isLoading: collectiblesLoading,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		allCollectibles,
	} = useListMarketCardData({
		collectionAddress,
		chainId,
		orderbookKind: orderbookKind as OrderbookKind,
		collectionType: collection?.type as ContractType,
		onCollectibleClick: handleCollectibleClick,
	});

	function handleCollectibleClick(tokenId: string) {
		setCollectibleId(tokenId);
		navigate(`/${ROUTES.COLLECTIBLE.path}`);
	}

	const renderItemContent = (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => {
		if (collectionLoading) {
			return (
				<div className="flex w-full min-w-[175px] items-stretch justify-center">
					<Text>Loading...</Text>
				</div>
			);
		}

		return (
			<div
				key={index}
				className="flex w-full min-w-[175px] items-stretch justify-center"
			>
				<Link to={'/collectible'} key={collectibleCard.collectibleId}>
					<CollectibleCard {...collectibleCard} />
				</Link>
			</div>
		);
	};

	return (
		<>
			{paginationMode === 'paginated' ? (
				<PaginatedView
					collectionAddress={collectionAddress}
					chainId={chainId}
					orderbookKind={orderbookKind as OrderbookKind}
					collection={collection as unknown as ContractInfo}
					collectionLoading={collectionLoading}
					onCollectibleClick={handleCollectibleClick}
				/>
			) : (
				<InfiniteScrollView
					collectionAddress={collectionAddress}
					chainId={chainId}
					collectibleCards={collectibleCards}
					collectiblesLoading={collectiblesLoading}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					fetchNextPage={fetchNextPage}
					allCollectibles={allCollectibles}
					renderItemContent={renderItemContent}
				/>
			)}
		</>
	);
}

function ShopContent1155() {
	const {
		sdkConfig,
		collectionAddress,
		chainId,
		orderbookKind,
		paginationMode,
	} = useMarketplace();
	const saleContractAddress = sdkConfig.tmpShopConfig.collections.find(
		(c) => c.address === collectionAddress,
	)?.primarySalesContractAddress;
	const saleItemIds = sdkConfig.tmpShopConfig.collections.find(
		(c) => c.address === collectionAddress,
	)?.tokenIds;
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	if (!saleContractAddress || !saleItemIds) {
		return <div>No sale contract address or item ids found</div>;
	}

	const { collectibleCards } = useList1155ShopCardData({
		contractAddress: collectionAddress,
		chainId,
		tokenIds: saleItemIds,
		salesContractAddress: saleContractAddress as Address,
	});

	const renderItemContent = (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => {
		if (collectionLoading) {
			return (
				<div className="flex w-full min-w-[175px] items-stretch justify-center">
					<Text>Loading...</Text>
				</div>
			);
		}

		return (
			<div
				key={index}
				className="flex w-full min-w-[175px] items-stretch justify-center"
			>
				<Link to={'/collectible'} key={collectibleCard.collectibleId}>
					<CollectibleCard {...collectibleCard} />
				</Link>
			</div>
		);
	};

	return (
		<>
			{paginationMode === 'paginated' ? (
				<PaginatedView
					collectionAddress={collectionAddress}
					chainId={chainId}
					orderbookKind={orderbookKind as OrderbookKind}
					collection={collection as unknown as ContractInfo}
					collectionLoading={collectionLoading}
					onCollectibleClick={() => {}}
				/>
			) : (
				<InfiniteScrollView
					collectionAddress={collectionAddress}
					chainId={chainId}
					collectibleCards={collectibleCards}
					collectiblesLoading={false}
					hasNextPage={false}
					isFetchingNextPage={false}
					fetchNextPage={null}
					renderItemContent={renderItemContent}
					allCollectibles={undefined}
				/>
			)}
		</>
	);
}

function ShopContent721() {
	const {
		sdkConfig,
		collectionAddress,
		chainId,
		orderbookKind,
		paginationMode,
	} = useMarketplace();
	const saleContractAddress = sdkConfig.tmpShopConfig.collections.find(
		(c) => c.address === collectionAddress,
	)?.primarySalesContractAddress;
	const saleItemIds = sdkConfig.tmpShopConfig.collections.find(
		(c) => c.address === collectionAddress,
	)?.tokenIds;
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	if (!saleContractAddress || !saleItemIds) {
		return <div>No sale contract address or item ids found</div>;
	}

	const { collectibleCards } = useList721ShopCardData({
		contractAddress: collectionAddress,
		chainId,
		tokenIds: saleItemIds,
		salesContractAddress: saleContractAddress as Address,
	});

	const renderItemContent = (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => {
		if (collectionLoading) {
			return (
				<div className="flex w-full min-w-[175px] items-stretch justify-center">
					<Text>Loading...</Text>
				</div>
			);
		}

		return (
			<div
				key={index}
				className="flex w-full min-w-[175px] items-stretch justify-center"
			>
				<Link to={'/collectible'} key={collectibleCard.collectibleId}>
					<CollectibleCard {...collectibleCard} />
				</Link>
			</div>
		);
	};

	return (
		<>
			{paginationMode === 'paginated' ? (
				<PaginatedView
					collectionAddress={collectionAddress}
					chainId={chainId}
					orderbookKind={orderbookKind as OrderbookKind}
					collection={collection as unknown as ContractInfo}
					collectionLoading={collectionLoading}
					onCollectibleClick={() => {}}
				/>
			) : (
				<InfiniteScrollView
					collectionAddress={collectionAddress}
					chainId={chainId}
					collectibleCards={collectibleCards}
					collectiblesLoading={false}
					hasNextPage={false}
					isFetchingNextPage={false}
					fetchNextPage={null}
					renderItemContent={renderItemContent}
					allCollectibles={undefined}
				/>
			)}
		</>
	);
}
