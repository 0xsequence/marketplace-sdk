'use client';

import { usePlayground } from '@/lib/PlaygroundContext';
import { ROUTES } from '@/lib/routes';
import {
	type ContractType,
	OrderSide,
	type OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import type { CollectibleOrder } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollection,
	useCollectionBalanceDetails,
	useListCollectibles,
	useListCollectiblesPaginated,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAccount } from 'wagmi';

// Define the action types enum to match the SDK
enum CollectibleCardAction {
	BUY = 'buy',
	OFFER = 'offer',
}

// Define a type for the collection balance that's safe to use
type SafeCollectionBalance = {
	balances?: Array<{
		tokenID?: string;
		balance?: string;
	}>;
};

export default function CollectiblesPage() {
	const router = useRouter();
	const {
		collectionAddress,
		chainId,
		setCollectibleId,
		orderbookKind,
		paginationMode,
		sdkConfig,
	} = usePlayground();
	const { address: accountAddress } = useAccount();

	// For paginated view
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 6;

	// Collection data
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	// Paginated collectibles data
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
			enabled:
				paginationMode === 'paginated' && !!collectionAddress && !!chainId,
		},
		filter: {
			includeEmpty: true,
		},
	});

	// Infinite scroll collectibles data
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
			enabled:
				paginationMode === 'infinite' && !!collectionAddress && !!chainId,
		},
	});

	// User's collection balance
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

	// Flatten the collectibles from all pages for infinite scroll
	const allCollectibles =
		infiniteData?.pages.flatMap((page) => page.collectibles) || [];

	const handleCollectibleClick = (tokenId: string) => {
		setCollectibleId(tokenId);
		router.push(`/${ROUTES.COLLECTIBLE.path}`);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleLoadMore = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	// Error state
	if (
		(paginationMode === 'paginated' && paginatedError) ||
		(paginationMode === 'infinite' && !infiniteData && !infiniteLoading)
	) {
		return (
			<div className="flex flex-col gap-4">
				<h2 className="text-xl font-semibold text-gray-100">Collectibles</h2>
				<div className="flex pt-3 justify-center p-6 bg-gray-800/80 rounded-xl border border-gray-700/30 shadow-lg">
					<p className="text-gray-300">Error loading collectibles</p>
				</div>
			</div>
		);
	}

	// Empty state
	const isEmpty =
		(paginationMode === 'paginated' &&
			paginatedData?.collectibles.length === 0 &&
			!paginatedLoading) ||
		(paginationMode === 'infinite' &&
			allCollectibles.length === 0 &&
			!infiniteLoading);

	if (isEmpty) {
		return (
			<div className="flex flex-col gap-4">
				<h2 className="text-xl font-semibold text-gray-100">Collectibles</h2>
				<div className="flex pt-3 justify-center p-6 bg-gray-800/80 rounded-xl border border-gray-700/30 shadow-lg">
					<p className="text-gray-300">No collectibles found</p>
				</div>
			</div>
		);
	}

	// Loading state
	const isLoading =
		(paginationMode === 'paginated' && paginatedLoading) ||
		(paginationMode === 'infinite' &&
			infiniteLoading &&
			allCollectibles.length === 0);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-semibold text-gray-100">Collectibles</h2>
				<p className="text-sm text-gray-400">
					Mode:{' '}
					{paginationMode === 'paginated' ? 'Paginated' : 'Infinite Scroll'}
				</p>
			</div>

			{isLoading ? (
				<div className="flex justify-center p-6 bg-gray-800/80 rounded-xl border border-gray-700/30 shadow-lg">
					<p className="text-gray-300">Loading collectibles...</p>
				</div>
			) : (
				<>
					{/* Grid of collectibles */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{paginationMode === 'paginated'
							? paginatedData?.collectibles.map((collectible) => (
									<div
										key={collectible.metadata.tokenId}
										className="overflow-hidden rounded-xl"
									>
										<CollectibleCard
											collectibleId={collectible.metadata.tokenId}
											chainId={chainId}
											collectionAddress={collectionAddress}
											orderbookKind={orderbookKind}
											collectionType={collection?.type as ContractType}
											lowestListing={collectible}
											onCollectibleClick={handleCollectibleClick}
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
									</div>
								))
							: allCollectibles.map((collectible) => (
									<div
										key={collectible.metadata.tokenId}
										className="overflow-hidden rounded-xl"
									>
										<CollectibleCard
											collectibleId={collectible.metadata.tokenId}
											chainId={chainId}
											collectionAddress={collectionAddress}
											orderbookKind={orderbookKind}
											collectionType={collection?.type as ContractType}
											lowestListing={collectible}
											onCollectibleClick={handleCollectibleClick}
											balance={
												collectionBalance?.balances?.find(
													(balance) =>
														balance.tokenID === collectible.metadata.tokenId,
												)?.balance
											}
											cardLoading={
												infiniteLoading ||
												collectionLoading ||
												collectionBalanceLoading
											}
											onCannotPerformAction={(action) => {
												console.log(`Cannot perform action: ${action}`);
											}}
										/>
									</div>
								))}
					</div>

					{/* Pagination controls */}
					{paginationMode === 'paginated' && (
						<div className="flex justify-center mt-4 gap-2">
							<button
								type="button"
								className={`px-4 py-2 rounded-md transition-colors ${
									currentPage <= 1
										? 'bg-gray-700 text-gray-500 cursor-not-allowed'
										: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
								}`}
								onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
								disabled={currentPage <= 1}
							>
								Previous
							</button>
							<span className="text-gray-300 text-sm font-bold flex items-center mx-2">
								Page {currentPage}
							</span>
							<button
								type="button"
								className={`px-4 py-2 rounded-md transition-colors ${
									!paginatedData?.page?.more
										? 'bg-gray-700 text-gray-500 cursor-not-allowed'
										: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
								}`}
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={!paginatedData?.page?.more}
							>
								Next
							</button>
						</div>
					)}

					{/* Load more button for infinite scroll */}
					{paginationMode === 'infinite' && hasNextPage && (
						<div className="flex justify-center mt-4">
							<button
								type="button"
								className={`px-4 py-2 rounded-md transition-colors ${
									isFetchingNextPage
										? 'bg-gray-700 text-gray-500 cursor-not-allowed'
										: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
								}`}
								onClick={handleLoadMore}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage ? 'Loading more...' : 'Load more'}
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
