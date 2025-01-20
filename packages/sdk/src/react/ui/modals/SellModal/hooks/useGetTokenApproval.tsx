import {
	GenerateSellTransactionArgs,
	getMarketplaceClient,
	MarketplaceKind,
	OrderData,
	StepType,
} from '../../../../_internal';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useConfig } from '../../../../hooks/useConfig';
import { useFees } from '../../BuyModal/hooks/useFees';

export interface UseGetTokenApprovalDataArgs {
	chainId: string;
	collectionAddress: string;
	marketplace: MarketplaceKind;
	ordersData: Array<OrderData>;
}

export const useGetTokenApprovalData = (
	params: UseGetTokenApprovalDataArgs,
) => {
	const config = useConfig();
	const { wallet } = useWallet();
	const marketplaceClient = getMarketplaceClient(params.chainId, config);
	const { amount, receiver } = useFees({
		chainId: Number(params.chainId),
		collectionAddress: params.collectionAddress,
	});

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['token-approval-data', params.ordersData],
		queryFn: async () => {
			const address = await wallet!.address();
			const args = {
				collectionAddress: params.collectionAddress,
				walletType: wallet!.walletKind,
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
		},
		enabled: !!wallet && !!params.collectionAddress,
	});

	return {
		data,
		isLoading,
		isSuccess,
	};
};
