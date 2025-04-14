import { Button, Text, useToast } from '@0xsequence/design-system';
import {
	type ContractType,
	type Order,
	OrderSide,
	type OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollectionBalanceDetails,
	useListCollectiblesPaginated,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import { useState } from 'react';
import { Link } from 'react-router';
import { handleOfferClick } from 'shared-components';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { CollectibleCardAction } from '../../../../../sdk/src/react/ui/components/_internals/action-button/types';

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
	collectionLoading,
	onCollectibleClick,
}: PaginatedViewProps) {
	const { address: accountAddress } = useAccount();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 6;

	const {
		data,
		isLoading: collectiblesLoading,
		error,
	} = useListCollectiblesPaginated({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		query: {
			page: currentPage,
			pageSize,
			enabled: !!collectionAddress && !!chainId,
		},
		filter: {
			includeEmpty: true,
		},
	});
	const { show: showSellModal } = useSellModal();

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

	const toast = useToast();

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 pt-3">
				<Text variant="large" color="error">
					Error loading collectibles
				</Text>
				<Text>{error.message}</Text>
			</div>
		);
	}

	if (data?.collectibles.length === 0 && !collectiblesLoading) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">No collectibles found</Text>
			</div>
		);
	}

	// Check if there are more pages available
	const hasMorePages = data?.page?.more === true;

	return (
		<>
			<div
				className="grid items-start gap-3 pt-3"
				style={{
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: '16px',
				}}
			>
				{collectiblesLoading ? (
					<div className="col-span-3 flex justify-center py-8">
						<Text>Loading collectibles...</Text>
					</div>
				) : (
					data?.collectibles.map((collectibleLowestListing) => (
						<Link
							to={'/collectible'}
							key={collectibleLowestListing.metadata.tokenId}
							className="w-full"
						>
							<CollectibleCard
								collectibleId={collectibleLowestListing.metadata.tokenId}
								chainId={chainId}
								collectionAddress={collectionAddress}
								orderbookKind={orderbookKind}
								collectionType={collection?.type as ContractType}
								lowestListing={collectibleLowestListing}
								onCollectibleClick={onCollectibleClick}
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
												tokenId: collectibleLowestListing.metadata.tokenId,
												order: order as Order,
											});
										},
										e: e,
									});
								}}
								balance={
									collectionBalance?.balances.find(
										(balance) =>
											balance.tokenID ===
											collectibleLowestListing.metadata.tokenId,
									)?.balance
								}
								balanceIsLoading={collectionBalanceLoading}
								cardLoading={
									collectiblesLoading ||
									collectionLoading ||
									collectionBalanceLoading
								}
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
					disabled={!hasMorePages}
				>
					Next
				</Button>
			</div>
		</>
	);
}
