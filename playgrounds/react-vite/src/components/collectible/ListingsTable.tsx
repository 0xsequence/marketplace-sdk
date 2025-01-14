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
			:  'Buy'
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
