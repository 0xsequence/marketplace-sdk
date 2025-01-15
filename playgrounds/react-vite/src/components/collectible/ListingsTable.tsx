import { Box, Text, useToast } from '@0xsequence/design-system';
import { compareAddress, type Order } from '@0xsequence/marketplace-sdk';
import {
	useBalanceOfCollectible,
	useBuyModal,
	useCancelOrder,
	useCountListingsForCollectible,
	useListListingsForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMarketplace } from '../../lib/MarketplaceContext';
import { OrdersTable } from './OrdersTable';

export const ListingsTable = () => {
	const { collectionAddress, chainId, collectibleId } = useMarketplace();
	const [page, setPage] = useState(0);
	const { address } = useAccount();
	const toast = useToast();

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

	const { cancelOrder, isExecuting: cancelIsExecuting } = useCancelOrder({
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
				title: 'Error',
				variant: 'error',
				description: error.message,
			});
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
				title: 'Error',
				variant: 'error',
				description: error.message,
			});
		},
	});

	const owned = balance?.balance || 0;

	const getLabel = (order: Order) => {
		return compareAddress(order.createdBy, address)
			? cancelIsExecuting
				? 'Cancelling...'
				: 'Cancel'
			: !owned
				? 'Buy'
				: undefined;
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

	return (
		<>
			<Box display="flex" alignItems="center" gap="4">
				<Text variant="medium" fontWeight="bold" fontFamily="body">
					{`${countOfListings?.count || 0} listings for this collectible`}
				</Text>
			</Box>

			<OrdersTable
				isLoading={listingsLoading}
				items={listings?.listings}
				emptyMessage="No listings available"
				getLabel={getLabel}
				onAction={handleAction}
				nextPage={() => setPage((prev) => prev + 1)}
				prevPage={() => setPage((prev) => prev - 1)}
				isPrevDisabled={page === 0}
				isNextDisabled={!listings?.page?.more}
				type="listings"
			/>
		</>
	);
};
