import { Box, Text, useToast } from '@0xsequence/design-system';
import { type Order, compareAddress } from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useCancelOrder,
	useCountListingsForCollectible,
	useListListingsForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMarketplace } from '../../../lib/MarketplaceContext';
import { OrdersTable } from './OrdersTable';

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
			//Show cancel if the order is created by the current user
			if (cancelIsExecuting) {
				//TODO: this should only affect the order that is being cancelled
				return 'Cancelling...';
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

			<OrdersTable
				isLoading={listingsLoading}
				items={listings?.listings}
				emptyMessage="No listings available"
				getLabel={getLabel}
				onAction={handleAction}
				nextPage={() => setPage((prev) => prev + 1)}
				prevPage={() => setPage((prev) => prev - 1)}
				isPrevDisabled={page <= 1}
				isNextDisabled={!listings?.page?.more}
				type="listings"
				currentPage={page}
			/>
		</>
	);
};
