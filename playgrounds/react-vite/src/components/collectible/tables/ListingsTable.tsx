import {
	GradientAvatar,
	Spinner,
	Text,
	useToast,
} from '@0xsequence/design-system';
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
import { useMarketplace } from '../../../lib/MarketplaceContext';
import {
	type Column,
	ControlledTable,
} from '../../../lib/Table/ControlledTable';
import { ActionCell } from './ActionCell';
import { CurrencyCell } from './CurrencyCell';

export const ListingsTable = ({
	contractType,
}: {
	contractType: ContractType;
}) => {
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
				pageSize: 30,
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
			console.error(error);
		},
	});

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
				title: 'An error occurred buying the collectible',
				variant: 'error',
				description: 'See console for more details',
			});
			console.error(error);
		},
	});

	const getLabel = (order: Order) => {
		const isOwner = compareAddress(order.createdBy, address);
		if (isOwner) {
			if (cancellingOrderId === order.orderId) {
				return <Spinner size="sm" />;
			}
			return 'Cancel';
		}
		return 'Buy';
	};

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

	const columns: Column<Order>[] = [
		...(contractType === ContractType.ERC1155
			? [
					{
						header: 'Quantity',
						key: 'quantity',
						render: (order: Order) => (
							<Text className="font-body" color="text100">
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
				<Text className="font-body" color="text100">
					{order.priceAmountFormatted}
				</Text>
			),
		},
		{
			header: 'Currency',
			key: 'priceCurrencyAddress',
			render: (order) => (
				<CurrencyCell currencyAddress={order.priceCurrencyAddress} />
			),
		},
		{
			header: 'Seller',
			key: 'createdBy',
			render: (order) => (
				<div className="flex items-center gap-1">
					<GradientAvatar address={order.createdBy} size="xs" />
					<Text className="font-body" color="text100">
						{truncateMiddle(order.createdBy, 3, 4)}
					</Text>
				</div>
			),
		},
		{
			header: 'Expiration',
			key: 'validUntil',
			render: (order) => (
				<Text className="font-body" color="text100">
					{new Date(order.validUntil).toLocaleDateString()}
				</Text>
			),
		},
		{
			header: 'Orderbook ',
			key: 'marketplace',
			render: (order) => {
				const marketplaceDetails = getMarketplaceDetails({
					originName: order.originName,
					kind: order.marketplace,
				});
				return (
					<div className="flex flex-nowrap gap-1 items-center">
						{marketplaceDetails?.logo && (
							<marketplaceDetails.logo className="w-3 h-3" />
						)}
						<Text className="text-xs font-body" fontWeight="bold">
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
				<ActionCell order={order} getLabel={getLabel} onAction={handleAction} />
			),
		},
	];

	return (
		<>
			<div className="flex items-center gap-4 w-full sticky top-0 bg-background-primary py-1 z-10">
				<Text className="font-body" variant="medium" fontWeight="bold">
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
					onPrevPage: () => setPage((prev) => prev - 1),
					isPrevDisabled: page <= 1,
					isNextDisabled: !listings?.page?.more,
					currentPage: page,
				}}
			/>
		</>
	);
};
