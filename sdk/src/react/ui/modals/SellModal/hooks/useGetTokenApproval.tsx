import { skipToken, useQuery } from '@tanstack/react-query';
import {
	type GenerateSellTransactionArgs,
	getMarketplaceClient,
	type MarketplaceKind,
	type OrderData,
	StepType,
} from '../../../../_internal';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useConfig } from '../../../../hooks/useConfig';
import { useMarketPlatformFee } from '../../BuyModal/hooks/useMarketPlatformFee';

export interface UseGetTokenApprovalDataArgs {
	chainId: number;
	collectionAddress: string;
	marketplace: MarketplaceKind;
	ordersData: Array<OrderData>;
}

export const useGetTokenApprovalData = (
	params: UseGetTokenApprovalDataArgs,
) => {
	const config = useConfig();
	const { wallet } = useWallet();
	const marketplaceClient = getMarketplaceClient(config);
	const { amount, receiver } = useMarketPlatformFee({
		chainId: Number(params.chainId),
		collectionAddress: params.collectionAddress,
	});

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['token-approval-data', params.ordersData],
		queryFn: wallet
			? async () => {
					const address = await wallet.address();
					const args = {
						chainId: String(params.chainId),
						collectionAddress: params.collectionAddress,
						walletType: wallet.walletKind,
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
		enabled: !!wallet && !!params.collectionAddress,
	});

	return {
		data,
		isLoading,
		isSuccess,
	};
};
