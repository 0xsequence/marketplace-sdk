import {
	Box,
	GradientAvatar,
	Spinner,
	Text,
	useToast,
} from '@0xsequence/design-system';
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
		onSuccess: (hash) => {
			toast({
				title: 'Success',
				variant: 'success',
				description: `Transaction submitted: ${hash}`,
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
							<Text fontFamily="body" color="text100">
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
				<Box display="flex" alignItems="center" gap="1">
					<GradientAvatar address={order.createdBy} size="xs" />
					<Text fontFamily="body" color="text100">
						{truncateMiddle(order.createdBy, 3, 4)}
					</Text>
				</Box>
			),
		},
		{
			header: 'Expiration',
			key: 'validUntil',
			render: (order) => (
				<Text fontFamily="body" color="text100">
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
					<Box
						background="backgroundMuted"
						paddingX="2"
						paddingY="1"
						display="inline-block"
						borderRadius="xs"
					>
						{marketplaceDetails?.logo && (
							<marketplaceDetails.logo width="3" height="3" />
						)}

						<Text fontSize="xsmall" fontFamily="body" fontWeight="bold">
							{marketplaceDetails?.displayName}
						</Text>
					</Box>
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
			<Box
				display="flex"
				alignItems="center"
				gap="4"
				width="full"
				position="sticky"
				top="0"
				background="backgroundPrimary"
				paddingY="1"
				zIndex="10"
			>
				<Text variant="medium" fontWeight="bold" fontFamily="body">
					{`${countOfOffers?.count || 0} offers for this collectible`}
				</Text>
			</Box>

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
