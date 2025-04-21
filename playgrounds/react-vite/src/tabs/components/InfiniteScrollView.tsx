import { Text, useToast } from '@0xsequence/design-system';
import { OrderSide, type OrderbookKind } from '@0xsequence/marketplace-sdk';
import type {
	CollectibleOrder,
	ContractType,
	Order,
} from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollectionBalanceDetails,
	useListCollectibles,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import React, { useState } from 'react';
import { Link } from 'react-router';
import { VirtuosoGrid } from 'react-virtuoso';
import { handleOfferClick, useFilterContext } from 'shared-components';
import { useAccount } from 'wagmi';
import { CollectibleCardAction } from '../../../../../sdk/src/react/ui/components/_internals/action-button/types';
import { GridContainer } from './GridContainer';

interface InfiniteScrollViewProps {
	collectionAddress: `0x${string}`;
	chainId: number;
	orderbookKind: OrderbookKind;
	collection: ContractInfo;
	collectionLoading: boolean;
	onCollectibleClick: (tokenId: string) => void;
}

export function InfiniteScrollView({
	collectionAddress,
	chainId,
	orderbookKind,
	collection,
	collectionLoading,
	onCollectibleClick,
}: InfiniteScrollViewProps) {
	const { address: accountAddress } = useAccount();
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
	const { appliedFilters } = useFilterContext();

	const {
		data: collectiblesWithListings,
		isLoading: collectiblesWithListingsLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage: isSDKFetchingNextPage,
	} = useListCollectibles({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: true,
			properties: appliedFilters,
		},
	});

	const { data: collectionBalance, isLoading: collectionBalanceLoading } =
		useCollectionBalanceDetails({
			chainId,
			filter: {
				accountAddresses: accountAddress ? [accountAddress] : [],
				omitNativeBalances: true,
				contractWhitelist: [collectionAddress],
			},
			query: {
				enabled: !!accountAddress,
			},
		});

	const toast = useToast();

	// Flatten the collectibles from all pages
	const allCollectibles = React.useMemo(() => {
		if (!collectiblesWithListings?.pages) return [];
		return collectiblesWithListings.pages.flatMap((page) => page.collectibles);
	}, [collectiblesWithListings?.pages]);

	// Update the isFetchingNextPage state when the SDK's isFetchingNextPage changes
	React.useEffect(() => {
		setIsFetchingNextPage(isSDKFetchingNextPage);
	}, [isSDKFetchingNextPage]);

	if (
		!collectiblesWithListings?.pages.length &&
		!collectiblesWithListingsLoading
	) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">No collectibles found</Text>
			</div>
		);
	}

	const { data: collectionBalanceDetails } = useCollectionBalanceDetails({
		chainId,
		filter: {
			accountAddresses: accountAddress ? [accountAddress] : [],
			contractWhitelist: [collectionAddress],
			omitNativeBalances: true,
		},
	});

	const { show: showSellModal } = useSellModal();

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
			setIsFetchingNextPage(true);
			fetchNextPage().finally(() => {
				setIsFetchingNextPage(false);
			});
		}
	};

	const renderItemContent = (
		index: number,
		collectibleLowestListing: CollectibleOrder,
	) => {
		return (
			<div
				key={index}
				className="flex w-full min-w-[175px] items-stretch justify-center"
			>
				<Link
					to={'/collectible'}
					key={collectibleLowestListing.metadata.tokenId}
				>
					<CollectibleCard
						key={collectibleLowestListing.metadata.tokenId}
						collectibleId={collectibleLowestListing.metadata.tokenId}
						chainId={chainId}
						collectionAddress={collectionAddress}
						orderbookKind={orderbookKind}
						collectionType={collection.type as ContractType}
						collectible={collectibleLowestListing}
						onCollectibleClick={onCollectibleClick}
						onOfferClick={({ order, e }) => {
							handleOfferClick({
								balances: collectionBalanceDetails?.balances || [],
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
									balance.tokenID === collectibleLowestListing.metadata.tokenId,
							)?.balance
						}
						balanceIsLoading={collectionBalanceLoading}
						cardLoading={
							collectiblesWithListingsLoading ||
							collectionLoading ||
							collectionBalanceLoading
						}
						onCannotPerformAction={(action) => {
							const label =
								action === CollectibleCardAction.BUY ? 'buy' : 'make offer for';
							toast({
								title: `You cannot ${label} this collectible`,
								description: `You can only ${label} collectibles you do not own`,
								variant: 'error',
							});
						}}
					/>
				</Link>
			</div>
		);
	};

	const FooterComponent = () => {
		if (!hasNextPage) return null;

		return (
			<div className="col-span-full flex justify-center py-4">
				{isFetchingNextPage ? (
					<Text>Loading more collectibles...</Text>
				) : (
					<Text color="text60">Scroll to load more</Text>
				)}
			</div>
		);
	};

	return (
		<div className="w-full">
			<VirtuosoGrid
				useWindowScroll
				components={{
					List: GridContainer,
					Footer: FooterComponent,
				}}
				itemContent={renderItemContent}
				endReached={handleEndReached}
				overscan={500}
				data={allCollectibles}
				listClassName="grid-container"
				style={{ height: '100%' }}
			/>
		</div>
	);
}
