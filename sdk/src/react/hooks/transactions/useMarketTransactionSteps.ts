import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Address } from 'viem';
import type { MarketplaceKind, AdditionalFee, Step } from '../../_internal/api';
import { WalletKind, getMarketplaceClient } from '../../_internal/api';
import { useConfig } from '../config';

export interface UseMarketTransactionStepsParams {
	chainId: number;
	collectionAddress: Address;
	buyer: Address;
	marketplace: MarketplaceKind;
	orderId: string;
	collectibleId: string;
	quantity: string;
	additionalFees?: AdditionalFee[];
	enabled?: boolean;
}

/**
 * Hook to generate transaction steps for market transactions (secondary sales)
 * This directly calls the marketplace API without using generators
 */
export function useMarketTransactionSteps({
	chainId,
	collectionAddress,
	buyer,
	marketplace,
	orderId,
	collectibleId,
	quantity,
	additionalFees = [],
	enabled = true,
}: UseMarketTransactionStepsParams) {
	const config = useConfig();
	const marketplaceClient = useMemo(
		() => getMarketplaceClient(config),
		[config],
	);

	return useQuery<Step[], Error>({
		queryKey: [
			'market-transaction-steps',
			{
				chainId,
				collectionAddress,
				buyer,
				orderId,
				collectibleId,
				quantity,
			},
		],
		queryFn: async () => {
			const response = await marketplaceClient.generateBuyTransaction({
				chainId: chainId.toString(),
				collectionAddress,
				buyer,
				marketplace,
				ordersData: [
					{
						orderId,
						quantity,
						tokenId: collectibleId,
					},
				],
				additionalFees,
				walletType: WalletKind.sequence,
			});

			return response.steps;
		},
		enabled: enabled && !!buyer,
	});
}
