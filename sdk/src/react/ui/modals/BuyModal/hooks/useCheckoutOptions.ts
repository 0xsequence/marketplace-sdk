import { skipToken, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import {
	type MarketplaceKind,
	getMarketplaceClient,
} from '../../../../_internal';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useConfig } from '../../../../hooks';
import { useFees } from './useFees';

export type CheckoutOptionsParams = {
	chainId: number;
	collectionAddress: Hex;
	orderId: string;
	marketplace: MarketplaceKind;
};

export const useCheckoutOptions = (
	input: CheckoutOptionsParams | typeof skipToken,
) => {
	const config = useConfig();
	const { wallet } = useWallet();

	// If input is skipToken, we don't want to calculate fees
	const fees = useFees(
		input !== skipToken
			? {
					chainId: input.chainId,
					collectionAddress: input.collectionAddress,
				}
			: skipToken,
	);

	return useQuery({
		queryKey:
			input !== skipToken
				? [
						'checkoutOptions',
						input.chainId,
						input.collectionAddress,
						input.orderId,
						input.marketplace,
					]
				: ['checkoutOptions', 'skip'],
		queryFn:
			wallet && input !== skipToken
				? async () => {
						const marketplaceClient = getMarketplaceClient(config);
						const response = await marketplaceClient.checkoutOptionsMarketplace(
							{
								wallet: await wallet.address(),
								orders: [
									{
										contractAddress: input.collectionAddress,
										orderId: input.orderId,
										marketplace: input.marketplace,
									},
								],
								additionalFee: Number(fees.amount),
								chainId: input.chainId.toString(),
							},
						);

						// Get order data
						const orderResponse = await marketplaceClient.getOrders({
							input: [
								{
									contractAddress: input.collectionAddress,
									orderId: input.orderId,
									marketplace: input.marketplace,
								},
							],
							chainId: input.chainId.toString(),
						});

						const order = orderResponse.orders[0];

						return {
							...response.options,
							order,
						};
					}
				: skipToken,
		enabled: !!wallet && input !== skipToken,
	});
};
