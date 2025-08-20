'use client';

import { Button, Spinner, useToast } from '@0xsequence/design-system';
import { type Order, OrderSide } from '@0xsequence/marketplace-sdk';
import {
	useBalanceOfCollectible,
	useBuyModal,
	useCancelOrder,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import type { ReactNode } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

const OrdersTableAction = ({
	collectionAddress,
	chainId,
	tokenId,
	order,
}: {
	collectionAddress: Address;
	chainId: number;
	tokenId: string | undefined;
	order: Order;
}) => {
	const toast = useToast();
	const { address: accountAddress } = useAccount();
	const { data: balance } = useBalanceOfCollectible({
		collectableId: tokenId ?? '',
		collectionAddress,
		chainId,
		userAddress: accountAddress,
		query: {
			enabled: !!accountAddress && !!tokenId,
		},
	});
	const { show: showSellModal } = useSellModal();
	const { cancelOrder, isExecuting, cancellingOrderId } = useCancelOrder({
		chainId,
		collectionAddress,
		onError: (error) => {
			toast({
				title: 'An error occurred while cancelling the order',
				variant: 'error',
				description: 'See console for more details',
			});
			console.error(error);
		},
		onSuccess: () => {
			toast({
				title: 'You canceled the order',
				variant: 'success',
				description: 'The order has been successfully canceled.',
			});
		},
	});
	const { show: openBuyModal } = useBuyModal({
		onError: (error) => {
			toast({
				title: 'An error occurred while purchasing',
				variant: 'error',
				description: error.message,
			});
		},
		onSuccess: () => {
			toast({
				title: 'You purchased the collectible',
				variant: 'success',
				description: 'The collectible has been successfully purchased.',
			});
		},
	});
	const accountHasCollectible = !!balance?.[0]?.balance || false;
	const orderCreatedByAccount =
		order.createdBy === accountAddress?.toLowerCase();
	const buttonProps: {
		label: ReactNode;
		onClick: () => void | Promise<void>;
	} | null =
		(order.side === OrderSide.offer &&
			accountHasCollectible && { label: 'Sell', onClick: handleSell }) ||
		(order.side === OrderSide.offer &&
			orderCreatedByAccount &&
			(isExecuting && cancellingOrderId === order.orderId
				? {
						label: <Spinner size="sm" />,
						// eslint-disable-next-line @typescript-eslint/no-empty-function
						onClick: () => {},
					}
				: {
						label: 'Cancel',
						onClick: handleCancelOrder,
					})) ||
		(order.side === OrderSide.listing &&
			orderCreatedByAccount && {
				label: 'Cancel',
				onClick: handleCancelOrder,
			}) ||
		(order.side === OrderSide.listing && {
			label: 'Buy',
			onClick: handleBuy,
		}) ||
		null;

	function handleSell() {
		if (!tokenId) return;

		showSellModal({
			chainId,
			collectionAddress,
			tokenId,
			order,
		});
	}

	async function handleCancelOrder() {
		await cancelOrder({
			orderId: order.orderId,
			marketplace: order.marketplace,
		});
	}

	function handleBuy() {
		if (!tokenId) return;

		openBuyModal({
			collectionAddress,
			chainId,
			collectibleId: tokenId,
			orderId: order.orderId,
			marketplace: order.marketplace,
		});
	}

	if (!buttonProps) {
		return null;
	}

	return (
		<Button
			label={buttonProps.label}
			onClick={buttonProps.onClick}
			variant="primary"
			size="xs"
			disabled={cancellingOrderId === order.orderId && isExecuting}
		/>
	);
};

export default OrdersTableAction;
