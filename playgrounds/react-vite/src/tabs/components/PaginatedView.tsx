import { Button, Text, useToast } from '@0xsequence/design-system';
import type {
	ContractType,
	Order,
	OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import { CollectibleCardAction } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollectionBalanceDetails,
	useFilterState,
	useListMarketCardData,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import { useState } from 'react';
import { Link } from 'react-router';
import { handleOfferClick } from 'shared-components';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

interface PaginatedViewProps {
	collectionAddress: Address;
	chainId: number;
	orderbookKind: OrderbookKind;
	collection: ContractInfo;
	collectionLoading: boolean;
	onCollectibleClick: (tokenId: string) => void;
}

export function PaginatedView({
	collectionAddress,
	chainId,
	orderbookKind,
	collection,
	onCollectibleClick,
}: PaginatedViewProps) {
	const { address: accountAddress } = useAccount();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 6;
	const { filterOptions } = useFilterState();

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
		orderbookKind,
		collectionType: collection?.type as ContractType,
		filterOptions,
		onCollectibleClick,
	});

	// Use pagination manually since we need a different UX than infinite scrolling
	const paginatedCards = collectibleCards.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const { show: showSellModal } = useSellModal();

	const { data: collectionBalance } = useCollectionBalanceDetails({
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

	const toast = useToast();

	const handlePageChange = (page: number) => {
		setCurrentPage(page);

		// Load more data if needed when navigating to a new page
		if (
			page > currentPage &&
			hasNextPage &&
			page * pageSize > collectibleCards.length
		) {
			fetchNextPage();
		}
	};

	if (allCollectibles.length === 0 && !collectiblesLoading) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">No collectibles found</Text>
			</div>
		);
	}

	return (
		<>
			<div
				className="grid items-start gap-3 pt-3"
				style={{
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: '16px',
				}}
			>
				{collectiblesLoading && paginatedCards.length === 0 ? (
					<div className="col-span-3 flex justify-center py-8">
						<Text>Loading collectibles...</Text>
					</div>
				) : (
					paginatedCards.map((collectibleCard) => (
						<Link
							to={'/collectible'}
							key={collectibleCard.collectibleId}
							className="w-full"
						>
							<CollectibleCard
								{...collectibleCard}
								onOfferClick={({ order, e }) => {
									handleOfferClick({
										balances: collectionBalance?.balances || [],
										accountAddress: accountAddress as `0x${string}`,
										chainId,
										collectionAddress,
										order: order as Order,
										showSellModal: () => {
											showSellModal({
												chainId,
												collectionAddress,
												tokenId: collectibleCard.collectibleId,
												order: order as Order,
											});
										},
										e: e,
									});
								}}
								onCannotPerformAction={(action) => {
									const label =
										action === CollectibleCardAction.BUY
											? 'buy'
											: 'make offer for';
									toast({
										title: `You cannot ${label} this collectible`,
										description: `You can only ${label} collectibles you do not own`,
										variant: 'error',
									});
								}}
							/>
						</Link>
					))
				)}
			</div>

			<div className="mt-4 flex justify-center gap-2">
				<Button
					className="bg-gray-900 text-gray-300"
					onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
					disabled={currentPage <= 1}
				>
					Previous
				</Button>
				<Text className="mx-2 flex items-center font-bold text-gray-300 text-sm">
					Page {currentPage}
				</Text>
				<Button
					className="bg-gray-900 text-gray-300"
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={!hasNextPage || isFetchingNextPage}
				>
					Next
				</Button>
			</div>
		</>
	);
}
