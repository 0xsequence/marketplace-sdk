import { Box, Spinner, Text, useToast } from '@0xsequence/design-system';
import { compareAddress, type Order } from '@0xsequence/marketplace-sdk';
import {
	useBalanceOfCollectible,
	useCancelOrder,
	useCountOffersForCollectible,
	useListOffersForCollectible,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMarketplace } from '../../lib/MarketplaceContext';
import { OrdersTable } from './OrdersTable';

export const OffersTable = () => {
	const { collectionAddress, chainId, collectibleId } = useMarketplace();
	const { address } = useAccount();
	const [page, setPage] = useState(0);
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

	return (
		<>
			<Box display="flex" alignItems="center" gap="4">
				<Text variant="medium" fontWeight="bold" fontFamily="body">
					{`${countOfOffers?.count || 0} offers for this collectible`}
				</Text>
			</Box>

			<OrdersTable
				isLoading={isLoading}
				items={offers?.offers}
				emptyMessage="No offers available"
				getLabel={getLabel}
				onAction={handleAction}
				nextPage={() => setPage((prev) => prev + 1)}
				prevPage={() => setPage((prev) => prev - 1)}
				isPrevDisabled={page === 0}
				isNextDisabled={!offers?.page?.more}
				type="offers"
			/>
		</>
	);
};
