import { Button, Text } from '@0xsequence/design-system';
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
import Link from 'next/link';
import { useState } from 'react';
import { handleOfferClick } from 'shared-components';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

interface PaginatedViewProps {
	collectionAddress: Hex;
	chainId: string;
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

	const {
		data: paginatedData,
		isLoading: paginatedLoading,
		error: paginatedError,
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

	const { data: collectionBalance, isLoading: collectionBalanceLoading } =
		useCollectionBalanceDetails({
			chainId: Number(chainId),
			filter: {
				accountAddresses: accountAddress ? [accountAddress] : [],
				contractWhitelist: [collectionAddress],
				omitNativeBalances: true,
			},
			query: {
				enabled: !!accountAddress,
			},
		});

	if (paginatedError) {
		return (
			<div className="flex justify-center">
				<Text variant="large">Error loading collectibles</Text>
			</div>
		);
	}

	if (paginatedData?.collectibles.length === 0 && !paginatedLoading) {
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
				{paginatedData?.collectibles.map((collectible) => (
					<div key={collectible.metadata.tokenId}>
						<Link
							href={'/collectible'}
							onClick={(e) => {
								e.preventDefault();
							}}
						>
							<CollectibleCard
								collectibleId={collectible.metadata.tokenId}
								chainId={chainId}
								collectionAddress={collectionAddress}
								orderbookKind={orderbookKind}
								collectionType={collection?.type as ContractType}
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
												tokenId: collectible.metadata.tokenId,
												order: order as Order,
											});
										},
										e: e,
									});
								}}
								lowestListing={collectible}
								onCollectibleClick={onCollectibleClick}
								balance={
									collectionBalance?.balances?.find(
										(balance) =>
											balance.tokenID === collectible.metadata.tokenId,
									)?.balance
								}
								cardLoading={
									paginatedLoading ||
									collectionLoading ||
									collectionBalanceLoading
								}
								onCannotPerformAction={(action) => {
									console.log(`Cannot perform action: ${action}`);
								}}
							/>
						</Link>
					</div>
				))}
			</div>

			<div className="mt-4 flex justify-center gap-2">
				<Button
					variant="secondary"
					onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
					disabled={currentPage <= 1}
				>
					Previous
				</Button>
				<Text variant="small" color="text80" className="mx-2 flex items-center">
					Page {currentPage}
				</Text>
				<Button
					variant="secondary"
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={!paginatedData?.page?.more}
				>
					Next
				</Button>
			</div>
		</>
	);
}
