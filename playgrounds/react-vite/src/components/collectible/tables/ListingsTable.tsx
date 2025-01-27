import {
	Box,
	Spinner,
	GradientAvatar,
	Text,
	useToast,
} from '@0xsequence/design-system';
import {
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
	ControlledTable,
	type Column,
} from '../../../lib/Table/ControlledTable';
import { CurrencyCell } from './CurrencyCell';
import { ActionCell } from './ActionCell';

export const ListingsTable = () => {
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
		onSuccess: ({ hash }) => {
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
			} else {
				return 'Cancel';
			}
		} else {
			return 'Buy';
		}
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
		{
			header: 'Price',
			key: 'priceAmountFormatted',
			render: (order) => (
				<Text fontFamily="body" color="text100">
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
					{`${countOfListings?.count || 0} listings for this collectible`}
				</Text>
			</Box>

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
