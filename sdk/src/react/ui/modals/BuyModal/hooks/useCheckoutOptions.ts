import { skipToken, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import {
	type MarketplaceKind,
	getMarketplaceClient,
} from '../../../../_internal';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useConfig } from '../../../../hooks';
import { useFees } from './useFees';

export const useCheckoutOptions = (input: {
	chainId: number;
	collectionAddress: Hex;
	orderId: string;
	marketplace: MarketplaceKind;
}) => {
	const config = useConfig();
	const { wallet } = useWallet();
	const fees = useFees({
		chainId: input.chainId,
		collectionAddress: input.collectionAddress,
	});

	return useQuery({
		queryKey: [
			'checkoutOptions',
			input.chainId,
			input.collectionAddress,
			input.orderId,
			input.marketplace,
		],
		queryFn: wallet
			? async () => {
					const marketplaceClient = getMarketplaceClient(input.chainId, config);
					const response = await marketplaceClient.checkoutOptionsMarketplace({
						wallet: await wallet.address(),
						orders: [
							{
								contractAddress: input.collectionAddress,
								orderId: input.orderId,
								marketplace: input.marketplace,
							},
						],
						additionalFee: Number(fees.amount),
					});

					// Get order data
					const orderResponse = await marketplaceClient.getOrders({
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
		enabled: !!wallet,
	});
};
