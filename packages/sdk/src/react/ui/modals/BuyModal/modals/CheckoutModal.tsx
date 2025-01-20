import { useEffect } from 'react';
import { parseUnits } from 'viem';
import type { Order } from '../../../../_internal';
import type {
	MarketplaceKind,
	TokenMetadata,
} from '../../../../_internal/api/marketplace.gen';

export interface BuyInput {
	orderId: string;
	collectableDecimals: number;
	marketplace: MarketplaceKind;
	quantity: string;
}

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
