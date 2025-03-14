'use client';

import { GradientAvatar, Text, useToast } from '@0xsequence/design-system';
import {
	ContractType,
	type Order,
	compareAddress,
	getMarketplaceDetails,
	truncateMiddle,
} from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useCancelOrder,
	useCountListingsForCollectible,
	useListListingsForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMarketplace } from '../../store/hook';
import { ActionCell } from './ActionCell';
import { type Column, ControlledTable } from './ControlledTable';
import { CurrencyCell } from './CurrencyCell';

export interface ListingsTableProps {
	contractType: ContractType;
	pageSize?: number;
}

export function ListingsTable({
	contractType,
	pageSize = 5,
}: ListingsTableProps) {
	const { collectionAddress, chainId, collectibleId } = useMarketplace();
	const [page, setPage] = useState(1);
	const { address } = useAccount();
	const toast = useToast();

	const { data: listings, isLoading: listingsLoading } =
		useListListingsForCollectible({
			collectionAddress,
			chainId,
			collectibleId,
			page: {
				page: page,
				pageSize,
			},
		});

	const { data: countOfListings } = useCountListingsForCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});

	const { cancelOrder, cancellingOrderId } = useCancelOrder({
		collectionAddress,
		chainId,
		onSuccess: () => {
			toast({
				title: 'Success',
				variant: 'success',
				description: 'You cancelled the listing',
			});
		},
		onError: (error) => {
			toast({
				title: 'An error occurred cancelling the order',
				variant: 'error',
				description: 'See console for more details',
			});
			console.error('Error cancelling listing', error);
		},
	});

	const { show: openBuyModal } = useBuyModal({
		onSuccess: ({ hash }) => {
			toast({
				title: 'Success',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
			});
		},
		onError: (error) => {
			toast({
				title: 'An error occurred buying the collectible',
				variant: 'error',
				description: 'See console for more details',
			});
			console.error('Error buying collectible', error);
		},
	});

	const handleAction = async (order: Order) => {
		if (compareAddress(order.createdBy, address)) {
			await cancelOrder({
				orderId: order.orderId,
				marketplace: order.marketplace,
			});
		} else {
			openBuyModal({
				collectionAddress,
				chainId,
				tokenId: collectibleId,
				order,
			});
		}
	};

	const getActionLabel = (order: Order) => {
		if (compareAddress(order.createdBy, address)) {
			return cancellingOrderId === order.orderId ? 'Cancelling...' : 'Cancel';
		}
		return 'Buy';
	};

	const columns: Column<Order>[] = [
		...(contractType === ContractType.ERC1155
			? [
					{
						header: 'Quantity',
						key: 'quantity',
						render: (order: Order) => (
							<Text variant="small" color="text100">
								{order.quantityAvailable}
							</Text>
						),
					},
				]
			: []),
		{
			header: 'Price',
			key: 'priceAmountFormatted',
			render: (order) => (
				<Text variant="small" color="text100">
					{order.priceAmountFormatted}
				</Text>
			),
		},
		{
			header: 'Currency',
			key: 'priceCurrencyAddress',
			render: (order) => (
				<CurrencyCell
					currencyAddress={order.priceCurrencyAddress}
					chainId={order.chainId}
				/>
			),
		},
		{
			header: 'Seller',
			key: 'createdBy',
			render: (order) => (
				<div className="flex items-center gap-1">
					<GradientAvatar address={order.createdBy} size="xs" />
					<Text variant="small" color="text100">
						{truncateMiddle(order.createdBy, 3, 4)}
					</Text>
				</div>
			),
		},
		{
			header: 'Expiration',
			key: 'validUntil',
			render: (order) => (
				<Text variant="small" color="text100">
					{new Date(order.validUntil).toLocaleDateString()}
				</Text>
			),
		},
		{
			header: 'Orderbook',
			key: 'marketplace',
			render: (order) => {
				const marketplaceDetails = getMarketplaceDetails({
					originName: order.originName,
					kind: order.marketplace,
				});
				return (
					<div className="flex flex-nowrap items-center gap-1 rounded-sm bg-gray-900 px-3 py-1">
						{marketplaceDetails?.logo && (
							<marketplaceDetails.logo className="h-3 w-3" />
						)}
						<Text variant="small" fontWeight="medium" className="text-left">
							{marketplaceDetails?.displayName}
						</Text>
					</div>
				);
			},
		},
		{
			header: 'Actions',
			key: 'actions',
			render: (order) => (
				<ActionCell
					item={order}
					onAction={handleAction}
					label={getActionLabel(order)}
				/>
			),
		},
	];

	return (
		<div className="flex flex-col gap-3">
			<div className="sticky top-0 z-10 flex w-full items-center gap-4 py-1">
				<Text variant="small" fontWeight="medium">
					{`${countOfListings?.count || 0} listings for this collectible`}
				</Text>
			</div>

			<ControlledTable<Order>
				isLoading={listingsLoading}
				items={listings?.listings}
				columns={columns}
				emptyMessage="No listings available"
				pagination={{
					onNextPage: () => setPage((prev) => prev + 1),
					onPrevPage: () => setPage((prev) => Math.max(1, prev - 1)),
					isPrevDisabled: page <= 1,
					isNextDisabled: !listings?.page?.more,
					currentPage: page,
				}}
			/>
		</div>
	);
}
