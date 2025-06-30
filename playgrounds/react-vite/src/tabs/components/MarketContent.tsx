import {
	type ContractType,
	cn,
	type OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollection,
	useFilterState,
	useListMarketCardData,
} from '@0xsequence/marketplace-sdk/react';
import { useNavigate, useParams } from 'react-router';
import {
	createRoute,
	InfiniteScrollView,
	PaginatedView,
	useMarketplace,
} from 'shared-components';
import type { Address } from 'viem';

export function MarketContent() {
	const navigate = useNavigate();
	const { collectionAddress, chainId } = useParams<{
		collectionAddress: string;
		chainId: string;
	}>();
	const { orderbookKind, paginationMode } = useMarketplace();
	const { filterOptions, searchText, showListedOnly } = useFilterState();

	const { data: collection } = useCollection({
		collectionAddress,
		chainId: Number(chainId),
		query: {
			enabled: !!collectionAddress && !!chainId,
		},
	});

	const { collectibleCards, isLoading: collectiblesLoading } =
		useListMarketCardData({
			orderbookKind: orderbookKind as OrderbookKind,
			collectionType: collection?.type as ContractType,
			filterOptions,
			searchText,
			showListedOnly,
			collectionAddress: collectionAddress as Address,
			chainId: Number(chainId),
		});

	function handleCollectibleClick(tokenId: string) {
		if (!collectionAddress || !chainId) return;

		const route = createRoute.collectible(
			Number(chainId),
			collectionAddress,
			tokenId,
		);
		navigate(route);
	}

	const renderItemContent = (index: number) => {
		const card = collectibleCards[index];
		if (!card) return null;

		return (
			<button
				onClick={() => handleCollectibleClick(card.collectibleId)}
				className={cn('w-full cursor-pointer')}
				type="button"
			>
				<CollectibleCard {...card} />
			</button>
		);
	};

	return paginationMode === 'paginated' ? (
		<PaginatedView
			collectionAddress={collectionAddress as Address}
			chainId={Number(chainId)}
			collectibleCards={collectibleCards}
			renderItemContent={renderItemContent}
			isLoading={collectiblesLoading}
		/>
	) : (
		<InfiniteScrollView
			collectionAddress={collectionAddress as Address}
			chainId={Number(chainId)}
			orderbookKind={orderbookKind as OrderbookKind}
			collectionType={collection?.type as ContractType}
			onCollectibleClick={handleCollectibleClick}
			renderItemContent={renderItemContent}
		/>
	);
}
