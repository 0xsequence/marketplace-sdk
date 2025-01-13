import type { BuyInput } from '../../../../_internal/transaction-machine/execute-transaction';
import type { Order, TokenMetadata } from '../../../../_internal';
import { useEffect } from 'react';
import { parseUnits } from 'viem';

export interface CheckoutModalProps {
	buy: (props: BuyInput) => void;
	collectable: TokenMetadata;
	order: Order;
	isLoading?: boolean;
}
export function CheckoutModal({ buy, collectable, order }: CheckoutModalProps) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const executeBuy = () => {
			buy({
				orderId: order.orderId,
				collectableDecimals: collectable.decimals || 0,
				quantity: parseUnits('1', collectable.decimals || 0).toString(),
				marketplace: order.marketplace,
			});
		};

		executeBuy();
	}, []);

	return null;
}
