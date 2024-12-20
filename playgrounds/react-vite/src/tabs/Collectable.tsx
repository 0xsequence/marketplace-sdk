import { Box, Card, Button, Text, useToast } from '@0xsequence/design-system';
import {
	useMakeOfferModal,
	useCreateListingModal,
	useTransferModal,
	useSellModal,
	CollectibleCard,
	useListListingsForCollectible,
	useListOffersForCollectible,
	useCurrencies,
	useCollectible,
	useCollection,
	useListCollectibles,
	useBalanceOfCollectible,
	useBuyModal,
	useCountListingsForCollectible,
	useCountOffersForCollectible,
	useCancelOrder,
} from '@0xsequence/marketplace-sdk/react';
import { useMarketplace } from '../lib/MarketplaceContext';
import { useAccount } from 'wagmi';
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from './../lib/Table/Table';
import {
	compareAddress,
	type ContractType,
	OrderSide,
	type Order,
	truncateMiddle,
} from '@0xsequence/marketplace-sdk';
import { useState } from 'react';
import { formatUnits } from 'viem';
import toTitleCaseFromSnakeCase from '../lib/util/toTitleCaseFromSnakeCase';

export function Collectible() {
	const context = useMarketplace();
	const { address: accountAddress } = useAccount();
	const { collectionAddress, chainId, collectibleId } = context;
	const { data: collectible, isLoading: collectibleLoading } = useCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});

	// we need to have this since we use CollectibleOrder type instead of Order in the CollectibleCard
	const { data: filteredCollectibles, isLoading: filteredCollectiblesLoading } =
		useListCollectibles({
			collectionAddress,
			chainId,
			side: OrderSide.listing,
			filter: {
				includeEmpty: true,
				searchText: collectible?.name,
			},
		});
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});
	const { data: balance } = useBalanceOfCollectible({
		collectionAddress,
		chainId,
		collectableId: collectibleId,
		userAddress: accountAddress,
	});

	const filteredCollectible = filteredCollectibles?.pages[0].collectibles.find(
		(fc) => fc.metadata.tokenId === collectibleId,
	);

	return (
		<Box paddingTop="3" gap="3" flexDirection="column">
			<Box gap="3">
				<Box>
					<CollectibleCard
						collectibleId={collectibleId}
						chainId={chainId}
						collectionAddress={collectionAddress}
						orderbookKind={context.orderbookKind}
						collectionType={collection?.type as ContractType}
						lowestListing={filteredCollectible}
						onOfferClick={({ order }) => console.log(order)}
						balance={balance?.balance}
						cardLoading={
							collectibleLoading ||
							filteredCollectiblesLoading ||
							collectionLoading
						}
					/>
				</Box>

				<Card gap="3" flexDirection="column">
					<Text variant="large">Collectible Details</Text>
					<Text>{`Name: ${collectible?.name}`}</Text>
					<Text>{`ID: ${collectibleId}`}</Text>
					<Text>{`You own: ${balance?.balance || 0} of this collectible`}</Text>
				</Card>
			</Box>
			<Actions isOwner={!!balance?.balance} />
			<ListingsTable />
			<OffersTable />
		</Box>
	);
}

function Actions({ isOwner }: { isOwner: boolean }) {
	const context = useMarketplace();
	const toast = useToast();

	const { show: openMakeOfferModal } = useMakeOfferModal({
		onSuccess: (hash) => {
			toast({
				title: 'Success',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
			});
		},
		onError: (error) => {
			console.log(error);
			toast({
				title: 'Error',
				variant: 'error',
				description: error.message,
			});
		},
	});

	const { show: openCreateListingModal } = useCreateListingModal({
		onSuccess: (hash) => {
			toast({
				title: 'Success',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
			});
		},
		onError: (error) => {
			toast({
				title: 'Error',
				variant: 'error',
				description: error.message,
			});
		},
	});

	const { show: openTransferModal } = useTransferModal();

	const { isConnected } = useAccount();

	const hooksProps = {
		collectionAddress: context.collectionAddress,
		chainId: context.chainId,
		collectibleId: context.collectibleId,
	};

	return (
		<Box>
			{!isConnected && (
				<Text variant="large">Connect Wallet to see collectable actions</Text>
			)}
			<Card gap="6" justifyContent="center">
				<Box gap="3">
					<Button
						variant="primary"
						onClick={() =>
							openMakeOfferModal({
								...hooksProps,
								orderbookKind: context.orderbookKind,
							})
						}
						label="Make Offer"
						disabled={!isConnected || isOwner}
					/>
				</Box>
				<Box gap="3">
					<Button
						variant="primary"
						onClick={() =>
							openCreateListingModal({
								...hooksProps,
								orderbookKind: context.orderbookKind,
							})
						}
						label="Create Listing"
						disabled={!isConnected || !isOwner}
					/>
					<Button
						variant="primary"
						onClick={() =>
							openTransferModal({
								collectionAddress: context.collectionAddress,
								chainId: context.chainId,
								collectibleId: context.collectibleId,
							})
						}
						label="Transfer"
						disabled={!isConnected || !isOwner}
					/>
				</Box>
			</Card>
		</Box>
	);
}

function ListingsTable() {
	const { collectionAddress, chainId, collectibleId } = useMarketplace();
	const [page, setPage] = useState(0);
	const { address } = useAccount();

	const nextPage = () => setPage((prev) => prev + 1);
	const prevPage = () => setPage((prev) => prev - 1);

	const { data: balance } = useBalanceOfCollectible({
		collectionAddress,
		chainId,
		collectableId: collectibleId,
		userAddress: address,
	});
	const { data: listings, isLoading: listingsLoading } =
		useListListingsForCollectible({
			collectionAddress,
			chainId,
			collectibleId,
			page: {
				page: page,
				pageSize: 30,
			},
		});
	const { data: countOfListings } = useCountListingsForCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});
	const [cancelTransactionExecuting, setCancelTransactionExecuting] =
		useState(false);
	const { cancel } = useCancelOrder({
		collectionAddress,
		chainId,
		enabled: cancelTransactionExecuting,
		onSwitchChainRefused: () => {
			setCancelTransactionExecuting(false);
		},
		onSuccess: (hash) => {
			toast({
				title: 'Success',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
			});

			setCancelTransactionExecuting(false);
		},
		onError: (error: Error) => {
			toast({
				title: 'Error',
				variant: 'error',
				description: error.message,
			});

			setCancelTransactionExecuting(false);
		},
	});
	const owned = balance?.balance || 0;

	const toast = useToast();
	const { show: openBuyModal } = useBuyModal({
		onSuccess: (hash) => {
			toast({
				title: 'Success',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
			});
		},
		onError: (error) => {
			toast({
				title: 'Error',
				variant: 'error',
				description: error.message,
			});
		},
	});

	const getLabel = (order: Order) => {
		return compareAddress(order.createdBy, address)
			? cancelTransactionExecuting
				? 'Cancelling...'
				: 'Cancel'
			: !owned
				? 'Buy'
				: undefined;
	};

	const handleAction = async (order: Order) => {
		if (compareAddress(order.createdBy, address)) {
			setCancelTransactionExecuting(true);

			await cancel({
				orderId: order.orderId,
				marketplace: order.marketplace,
			});
		} else {
			openBuyModal({
				collectionAddress: collectionAddress,
				chainId: chainId,
				tokenId: collectibleId,
				order: order,
			});
		}
	};

	return (
		<>
			<Box display="flex" alignItems="center" gap="4">
				<Text
					variant="medium"
					fontWeight="bold"
					fontFamily="body"
				>{`${countOfListings?.count} listings for this collectible`}</Text>
			</Box>

			<OrdersTable
				isLoading={listingsLoading}
				items={listings?.listings}
				emptyMessage="No listings available"
				getLabel={getLabel}
				onAction={handleAction}
				nextPage={nextPage}
				prevPage={prevPage}
				isPrevDisabled={page === 0}
				isNextDisabled={!listings?.page?.more}
				type="listings"
			/>
		</>
	);
}

function OffersTable() {
	const { collectionAddress, chainId, collectibleId } = useMarketplace();
	const { address } = useAccount();
	const [page, setPage] = useState(0);

	const nextPage = () => setPage((prev) => prev + 1);
	const prevPage = () => setPage((prev) => prev - 1);

	const { data: balance } = useBalanceOfCollectible({
		collectionAddress,
		chainId,
		collectableId: collectibleId,
		userAddress: address,
	});
	const { data: offers, isLoading } = useListOffersForCollectible({
		collectionAddress,
		chainId,
		collectibleId,
		page: {
			page: page,
			pageSize: 30,
		},
	});
	const { data: countOfOffers } = useCountOffersForCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});
	const [cancelTransactionExecuting, setCancelTransactionExecuting] =
		useState(false);
	const { cancel } = useCancelOrder({
		collectionAddress,
		chainId,
		enabled: cancelTransactionExecuting,
		onSwitchChainRefused: () => {
			setCancelTransactionExecuting(false);
		}
	});
	const owned = balance?.balance || 0;
	const toast = useToast();
	const { show: openSellModal } = useSellModal({
		onSuccess: (hash) => {
			toast({
				title: 'Success',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
			});

			setCancelTransactionExecuting(false);
		},
		onError: (error) => {
			toast({
				title: 'Error',
				variant: 'error',
				description: error.message,
			});

			setCancelTransactionExecuting(false);
		},
	});

	const getLabel = (order: Order) => {
		return compareAddress(order.createdBy, address)
			? cancelTransactionExecuting
				? 'Cancelling...'
				: 'Cancel'
			: !!owned
				? 'Sell'
				: undefined;
	};

	const handleAction = async (order: Order) => {
		if (compareAddress(order.createdBy, address)) {
			setCancelTransactionExecuting(true);

			await cancel({
				orderId: order.orderId,
				marketplace: order.marketplace,
			});
		} else {
			openSellModal({
				collectionAddress: collectionAddress,
				chainId: chainId,
				tokenId: collectibleId,
				order: order,
			});
		}
	};

	return (
		<>
			<Box display="flex" alignItems="center" gap="4">
				<Text
					variant="medium"
					fontWeight="bold"
					fontFamily="body"
				>{`${countOfOffers?.count} offers for this collectible`}</Text>
			</Box>

			<OrdersTable
				isLoading={isLoading}
				owned={!!owned}
				items={offers?.offers}
				emptyMessage="No offers available"
				getLabel={getLabel}
				onAction={handleAction}
				nextPage={nextPage}
				prevPage={prevPage}
				isPrevDisabled={page === 0}
				isNextDisabled={!offers?.page?.more}
				disableOnAction={(order) => !compareAddress(order.createdBy, address)}
				type="offers"
			/>
		</>
	);
}

interface TableProps {
	isLoading: boolean;
	owned?: boolean;
	items?: Order[];
	emptyMessage: string;
	getLabel: (
		order: Order,
	) => 'Buy' | 'Sell' | 'Cancel' | 'Cancelling...' | undefined;
	onAction: (order: Order) => void | Promise<void>;
	disableOnAction?: (order: Order) => boolean;
	type: 'listings' | 'offers';
	nextPage: () => void;
	prevPage: () => void;
	isPrevDisabled: boolean;
	isNextDisabled: boolean;
}

function OrdersTable({
	isLoading,
	owned,
	items,
	emptyMessage,
	getLabel,
	onAction,
	type,
	nextPage,
	prevPage,
	isPrevDisabled,
	isNextDisabled,
}: TableProps) {
	if (isLoading) {
		return <Box>Loading {type}...</Box>;
	}

	if (!items?.length) {
		return <Box>{emptyMessage}</Box>;
	}

	return (
		<Box background="backgroundMuted" borderRadius="md">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								Price
							</Text>
						</TableHead>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								Currency
							</Text>
						</TableHead>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								{type === 'listings' ? 'Seller' : 'Buyer'}
							</Text>
						</TableHead>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								Expiration
							</Text>
						</TableHead>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								Orderbook
							</Text>
						</TableHead>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								Actions
							</Text>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => (
						<OrdersTableRow
							key={item.orderId}
							order={item}
							owned={owned}
							getLabel={getLabel}
							onAction={onAction}
						/>
					))}
				</TableBody>
			</Table>
			<Box
				style={{
					display: 'flex',
					gap: '1rem',
					alignItems: 'center',
				}}
				paddingBottom="4"
				paddingLeft="4"
			>
				<Button
					size="xs"
					label="Previous page"
					onClick={prevPage}
					disabled={isPrevDisabled}
				/>
				<Button
					size="xs"
					label="Next page"
					onClick={nextPage}
					disabled={isNextDisabled}
				/>
			</Box>
		</Box>
	);
}

function OrdersTableRow({
	order,
	getLabel,
	onAction,
}: {
	order: Order;
	owned?: boolean;
	getLabel: (
		order: Order,
	) => 'Buy' | 'Sell' | 'Cancel' | 'Cancelling...' | undefined;
	onAction: (order: Order) => void | Promise<void>;
}) {
	const label = getLabel(order);
	const { chainId } = useMarketplace();
	const { data: currencies } = useCurrencies({ chainId });

	const getCurrency = (currencyAddress: string) => {
		return currencies?.find(
			(currency) => currency.contractAddress === currencyAddress,
		);
	};

	return (
		<TableRow key={order.orderId}>
			<TableCell>
				<Text fontFamily="body">
					{formatUnits(
						BigInt(order.priceAmount),
						Number(getCurrency(order.priceCurrencyAddress)?.decimals),
					)}
				</Text>
			</TableCell>
			<TableCell>
				<Text fontFamily="body">
					{getCurrency(order.priceCurrencyAddress)?.symbol}
				</Text>
			</TableCell>
			<TableCell>
				<Text fontFamily="body">{truncateMiddle(order.createdBy, 3, 4)}</Text>
			</TableCell>
			<TableCell>
				<Text fontFamily="body">
					{new Date(order.validUntil).toLocaleDateString()}
				</Text>
			</TableCell>
			<TableCell>
				<Box
					background="backgroundMuted"
					paddingX="2"
					paddingY="1"
					display="inline-block"
					borderRadius="xs"
				>
					<Text fontSize="xsmall" fontFamily="body" fontWeight="bold">
						{toTitleCaseFromSnakeCase(order.marketplace)}
					</Text>
				</Box>
			</TableCell>
			{label && (
				<TableCell>
					<Button
						size="xs"
						onClick={async () => {
							await onAction(order);
						}}
						label={label}
					/>
				</TableCell>
			)}
		</TableRow>
	);
}
