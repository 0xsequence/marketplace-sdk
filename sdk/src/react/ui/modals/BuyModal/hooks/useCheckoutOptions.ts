import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import {
	getMarketplaceClient,
	type MarketplaceKind,
} from '../../../../_internal';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useConfig } from '../../../../hooks';
import { useMarketPlatformFee } from './useMarketPlatformFee';

export type CheckoutOptionsParams = {
	chainId: number;
	collectionAddress: Address;
	orderId: string;
	marketplace: MarketplaceKind;
};

export const useCheckoutOptions = (
	input: CheckoutOptionsParams | typeof skipToken,
) => {
	const config = useConfig();
	const { wallet } = useWallet();

	// If input is skipToken, we don't want to calculate fees
	const fees = useMarketPlatformFee(
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
								chainId: String(input.chainId),
								wallet: await wallet.address(),
								orders: [
									{
										contractAddress: input.collectionAddress,
										orderId: input.orderId,
										marketplace: input.marketplace,
									},
								],
								additionalFee: Number(fees.amount),
							},
						);

						// Get order data
						const orderResponse = await marketplaceClient.getOrders({
							chainId: String(input.chainId),
							input: [
								{
									contractAddress: input.collectionAddress,
									orderId: input.orderId,
									marketplace: input.marketplace,
								},
							],
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
