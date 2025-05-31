import { Button, Text } from '@0xsequence/design-system';
import type {
	ContractType,
	Order,
	OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollectionBalanceDetails,
	useFilterState,
	useListMarketCardData,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import Link from 'next/link';
import { useState } from 'react';
import { handleOfferClick } from 'shared-components';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

interface PaginatedViewProps {
	collectionAddress: Hex;
	chainId: number;
	orderbookKind: OrderbookKind;
	collection: ContractInfo | undefined;
	collectionLoading: boolean;
	onCollectibleClick: (tokenId: string) => void;
}

export function PaginatedView({
	collectionAddress,
	chainId,
	orderbookKind,
	collection,
	collectionLoading,
	onCollectibleClick,
}: PaginatedViewProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 6;
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();
	const { filterOptions } = useFilterState();

	// Error handler for actions that cannot be performed
	const handleCannotPerformAction = (action: CollectibleCardAction) => {
		// In production, you might want to show a toast notification or modal
		// For now, we'll use console.error for proper error tracking
		console.error(`[CollectibleCard] Cannot perform action: ${action}`, {
			collectionAddress,
			chainId,
			accountAddress,
			action,
		});
	};

	const {
		collectibleCards,
		isLoading: collectiblesLoading,
		hasNextPage,
		allCollectibles,
	} = useListMarketCardData({
		collectionAddress,
		chainId,
		orderbookKind,
		collectionType: collection?.type || ContractType.ERC721,
		filterOptions,
		onCollectibleClick,
		onCannotPerformAction: handleCannotPerformAction,
	});

	// Paginate the results client-side
	const paginatedCards = collectibleCards.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

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

	if (allCollectibles.length === 0 && !collectiblesLoading) {
		return (
			<div className="flex justify-center">
				<Text variant="large">No collectibles found</Text>
			</div>
		);
	}

	return (
		<>
			<div
				className="grid gap-4"
				style={{
					gridTemplateColumns: 'repeat(3, 1fr)',
				}}
			>
				{paginatedCards.map((collectibleCard) => (
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
				))}
			</div>

			<div className="mt-4 flex justify-center gap-2">
				<Button
					variant="ghost"
					onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
					disabled={currentPage <= 1}
				>
					Previous
				</Button>
				<Text variant="small" color="text80" className="mx-2 flex items-center">
					Page {currentPage}
				</Text>
				<Button
					variant="ghost"
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={currentPage * pageSize >= collectibleCards.length}
				>
					Next
				</Button>
			</div>
		</>
	);
}
