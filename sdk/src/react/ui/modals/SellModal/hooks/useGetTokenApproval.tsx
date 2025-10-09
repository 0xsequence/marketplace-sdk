import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import {
	type GenerateSellTransactionArgs,
	getMarketplaceClient,
	type MarketplaceKind,
	type OrderData,
	StepType,
} from '../../../../_internal';
import { useConfig, useConnectorMetadata } from '../../../../hooks';
import { useMarketPlatformFee } from '../../BuyModal/hooks/useMarketPlatformFee';

export interface UseGetTokenApprovalDataArgs {
	chainId: number;
	collectionAddress: Address;
	marketplace: MarketplaceKind;
	ordersData: Array<OrderData>;
}

export const useGetTokenApprovalData = (
	params: UseGetTokenApprovalDataArgs,
) => {
	const config = useConfig();
	const { address } = useAccount();
	const { walletKind } = useConnectorMetadata();
	const marketplaceClient = getMarketplaceClient(config);
	const { amount, receiver } = useMarketPlatformFee({
		chainId: Number(params.chainId),
		collectionAddress: params.collectionAddress,
	});

	const { data, isLoading, isSuccess, isError, error } = useQuery({
		queryKey: ['token-approval-data', params.ordersData],
		queryFn: address
			? async () => {
					const args = {
						chainId: String(params.chainId),
						collectionAddress: params.collectionAddress,
						walletType: walletKind,
						seller: address,
						marketplace: params.marketplace,
						ordersData: params.ordersData,
						additionalFees: [
							{
								amount,
								receiver,
							},
						],
					} satisfies GenerateSellTransactionArgs;
					const steps = await marketplaceClient
						.generateSellTransaction(args)
						.then((resp) => resp.steps);

					const tokenApprovalStep = steps.find(
						(step) => step.id === StepType.tokenApproval,
					);
					if (!tokenApprovalStep) {
						return {
							step: null,
						};
					}

					return {
						step: tokenApprovalStep,
					};
				}
			: skipToken,
		enabled: !!address && !!params.collectionAddress,
	});

	return {
		data,
		isLoading,
		isSuccess,
		isError,
		error,
	};
};
