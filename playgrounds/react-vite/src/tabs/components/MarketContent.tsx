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
import { useNavigate } from 'react-router';
import {
	createRoute,
	InfiniteScrollView,
	PaginatedView,
	useMarketplace,
} from 'shared-components';

export function MarketContent() {
	const navigate = useNavigate();
	const {
		collectionAddress,
		chainId,
		setCollectibleId,
		orderbookKind,
		paginationMode,
	} = useMarketplace();
	const { filterOptions, searchText, showListedOnly } = useFilterState();

	const { data: collection } = useCollection({
		collectionAddress,
		chainId,
	});

	const { collectibleCards, isLoading: collectiblesLoading } =
		useListMarketCardData({
			collectionAddress,
			chainId,
			orderbookKind: orderbookKind as OrderbookKind,
			collectionType: collection?.type as ContractType,
			filterOptions,
			searchText,
			showListedOnly,
		});

	function handleCollectibleClick(tokenId: string) {
		setCollectibleId(tokenId);
		const route = createRoute.collectible(chainId, collectionAddress, tokenId);
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
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleCards={collectibleCards}
			renderItemContent={renderItemContent}
			isLoading={collectiblesLoading}
		/>
	) : (
		<InfiniteScrollView
			collectionAddress={collectionAddress}
			chainId={chainId}
			orderbookKind={orderbookKind as OrderbookKind}
			collectionType={collection?.type as ContractType}
			onCollectibleClick={handleCollectibleClick}
			renderItemContent={renderItemContent}
		/>
	);
}
