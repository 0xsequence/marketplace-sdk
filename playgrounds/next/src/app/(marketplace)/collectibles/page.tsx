'use client';

import { Text } from '@0xsequence/design-system';
import type {
	ContractType,
	Order,
	OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import { OrderSide } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollection,
	useCollectionBalanceDetails,
	useListCollectibles,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
	handleOfferClick,
	InfiniteScrollView,
	PaginatedView,
	useMarketplace,
} from 'shared-components';
import { useAccount } from 'wagmi';
import { ROUTES } from '@/lib/routes';

export default function CollectiblesPage() {
	const router = useRouter();
	const {
		collectionAddress,
		chainId,
		setCollectibleId,
		orderbookKind,
		paginationMode,
	} = useMarketplace();

	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();

	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	const {
		data: infiniteData,
		isLoading: infiniteLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useListCollectibles({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: true,
		},
		query: {
			enabled: !!collectionAddress && !!chainId,
		},
	});

	const { data: collectionBalance, isLoading: collectionBalanceLoading } =
		useCollectionBalanceDetails({
			chainId,
			filter: {
				accountAddresses: accountAddress ? [accountAddress] : [],
				contractWhitelist: [collectionAddress],
				omitNativeBalances: true,
			},
			query: {
				enabled: !!accountAddress,
			},
		});

	const allCollectibles =
		infiniteData?.pages.flatMap((page) => page.collectibles) || [];

	const handleCollectibleClick = (tokenId: string) => {
		setCollectibleId(tokenId);
		router.push(`/${ROUTES.COLLECTIBLE.path}`);
	};

	// Prepare collectible cards data for shared components
	const collectibleCards = allCollectibles.map((collectible) => ({
		collectibleId: collectible.metadata.tokenId,
		chainId,
		collectionAddress,
		orderbookKind: orderbookKind as OrderbookKind,
		collectionType: collection?.type as ContractType,
		collectible,
		onCollectibleClick: () =>
			handleCollectibleClick(collectible.metadata.tokenId),
		balance: collectionBalance?.balances?.find(
			(balance) => balance.tokenID === collectible.metadata.tokenId,
		)?.balance,
		balanceIsLoading: collectionBalanceLoading,
		onOfferClick: ({
			order,
			e,
		}: {
			order?: Order;
			e: React.MouseEvent<HTMLButtonElement>;
		}) => {
			if (!order) return;
			handleOfferClick({
				balances: collectionBalance?.balances || [],
				accountAddress: accountAddress as `0x${string}`,
				chainId,
				collectionAddress,
				order: order,
				showSellModal: () => {
					showSellModal({
						chainId,
						collectionAddress,
						tokenId: collectible.metadata.tokenId,
						order: order,
					});
				},
				e: e,
			});
		},
		cardLoading:
			infiniteLoading || collectionLoading || collectionBalanceLoading,
		onCannotPerformAction: (action: string) => {
			console.log(`Cannot perform action: ${action}`);
		},
	}));

	const renderItemContent = (_index: number, collectibleCard: any) => (
		<div key={collectibleCard.collectibleId}>
			<Link
				href={'/collectible'}
				onClick={(e) => {
					e.preventDefault();
				}}
			>
				<CollectibleCard {...collectibleCard} />
			</Link>
		</div>
	);

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">Collectibles</Text>
				<Text variant="small" color="text80">
					Mode:{' '}
					{paginationMode === 'paginated' ? 'Paginated' : 'Infinite Scroll'}
				</Text>
			</div>

			{paginationMode === 'paginated' ? (
				<PaginatedView
					collectibleCards={collectibleCards}
					renderItemContent={renderItemContent}
					isLoading={infiniteLoading}
				/>
			) : (
				<InfiniteScrollView
					collectionAddress={collectionAddress}
					chainId={chainId}
					collectibleCards={collectibleCards}
					collectiblesLoading={infiniteLoading}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					fetchNextPage={fetchNextPage}
					allCollectibles={allCollectibles}
					renderItemContent={renderItemContent}
					showFilters={false}
				/>
			)}
		</div>
	);
}
