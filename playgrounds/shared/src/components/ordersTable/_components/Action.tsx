'use client';

import { Button, Spinner } from '@0xsequence/design-system';
import { type Order, OrderSide } from '@0xsequence/marketplace-sdk';
import {
	useBalanceOfCollectible,
	useBuyModal,
	useCancelOrder,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
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
	tokenId: bigint | undefined;
	order: Order;
}) => {
	const { address: accountAddress } = useAccount();
	const { data: balance } = useBalanceOfCollectible({
		tokenId,
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
			toast.error('An error occurred while cancelling the order');
			console.error(error);
		},
		onSuccess: () => {
			toast.success('You canceled the order');
		},
	});
	const { show: openBuyModal } = useBuyModal({
		onError: (error) => {
			toast.error(`An error occurred while purchasing: ${error.message}`);
		},
		onSuccess: () => {
			toast.success('You purchased the collectible');
		},
	});
	const accountHasCollectible = !!balance?.balance || false;
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
		if (tokenId === undefined) return;

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
			tokenId,
			orderId: order.orderId,
			marketplace: order.marketplace,
		});
	}

	if (!buttonProps) {
		return null;
	}

	return (
		<Button
			onClick={buttonProps.onClick}
			variant="primary"
			size="xs"
			disabled={cancellingOrderId === order.orderId && isExecuting}
		>
			{buttonProps.label}
		</Button>
	);
};

export default OrdersTableAction;
