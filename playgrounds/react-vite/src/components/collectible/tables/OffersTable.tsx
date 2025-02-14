import {
	GradientAvatar,
	Spinner,
	Text,
	useToast,
} from '@0xsequence/design-system2';
import {
	ContractType,
	compareAddress,
	getMarketplaceDetails,
	truncateMiddle,
	type Order,
} from '@0xsequence/marketplace-sdk';
import {
	useBalanceOfCollectible,
	useCancelOrder,
	useCountOffersForCollectible,
	useListOffersForCollectible,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMarketplace } from '../../../lib/MarketplaceContext';
import {
	ControlledTable,
	type Column,
} from '../../../lib/Table/ControlledTable';
import { CurrencyCell } from './CurrencyCell';
import { ActionCell } from './ActionCell';

export const OffersTable = ({
	contractType,
}: {
	contractType: ContractType;
}) => {
	const { collectionAddress, chainId, collectibleId } = useMarketplace();
	const { address } = useAccount();
	const [page, setPage] = useState(1);
	const toast = useToast();

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

	const { cancelOrder, cancellingOrderId } = useCancelOrder({
		collectionAddress,
		chainId,
		onSuccess: () => {
			toast({
				title: 'Success',
				variant: 'success',
				description: 'You cancelled the offer',
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

	const { show: openSellModal } = useSellModal({
		onSuccess: ({ hash }) => {
			toast({
				title: 'You just sold your collectible',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
			});
		},
		onError: (error) => {
			toast({
				title: 'An error occurred selling the collectible',
				variant: 'error',
				description: 'See console for more details',
			});
			console.error(error);
		},
	});

	const owned = balance?.balance || 0;

	const getLabel = (order: Order) => {
		return compareAddress(order.createdBy, address) ? (
			cancellingOrderId === order.orderId ? (
				<Spinner size="sm" />
			) : (
				'Cancel'
			)
		) : owned ? (
			'Sell'
		) : undefined;
	};

	const handleAction = async (order: Order) => {
		if (compareAddress(order.createdBy, address)) {
			await cancelOrder({
				orderId: order.orderId,
				marketplace: order.marketplace,
			});
		} else {
			openSellModal({
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
			header: 'Currency',
			key: 'priceCurrencyAddress',
			render: (order) => (
				<CurrencyCell currencyAddress={order.priceCurrencyAddress} />
			),
		},
		{
			header: 'Buyer',
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
			header: 'Orderbook',
			key: 'marketplace',
			render: (order) => {
				const marketplaceDetails = getMarketplaceDetails({
					originName: order.originName,
					kind: order.marketplace,
				});
				return (
					<div className="bg-background-muted px-2 py-1 inline-block rounded-sm">
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
					{`${countOfOffers?.count || 0} offers for this collectible`}
				</Text>
			</div>
			<ControlledTable<Order>
				isLoading={isLoading}
				items={offers?.offers}
				columns={columns}
				emptyMessage="No offers available"
				pagination={{
					onNextPage: () => setPage((prev) => prev + 1),
					onPrevPage: () => setPage((prev) => prev - 1),
					isPrevDisabled: page <= 1,
					isNextDisabled: !offers?.page?.more,
					currentPage: page,
				}}
			/>
		</>
	);
};
