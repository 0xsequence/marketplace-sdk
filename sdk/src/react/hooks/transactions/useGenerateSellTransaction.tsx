import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types/index';
import {
	type GenerateSellTransactionArgs,
	getMarketplaceClient,
} from '../../_internal';
import type { Step } from '../../_internal/api/marketplace.gen';
import { useConfig } from '../config/useConfig';

interface UseGenerateSellTransactionArgs {
	chainId: number;
	onSuccess?: (steps?: Step[]) => void;
}

type GenerateSellTransactionArgsWithNumberChainId = Omit<
	GenerateSellTransactionArgs,
	'chainId'
> & { chainId: number };

export const generateSellTransaction = async (
	args: GenerateSellTransactionArgsWithNumberChainId,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	const argsWithStringChainId = {
		...args,
		chainId: String(args.chainId),
	} satisfies GenerateSellTransactionArgs;
	return marketplaceClient
		.generateSellTransaction(argsWithStringChainId)
		.then((data) => data.steps);
};

export const useGenerateSellTransaction = (
	params: UseGenerateSellTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: (data) => {
			// Only pass the data (steps) to the user's onSuccess callback to maintain backwards compatibility
			if (params.onSuccess) {
				params.onSuccess(data);
			}
		},
		mutationFn: (
			args: Omit<GenerateSellTransactionArgsWithNumberChainId, 'chainId'>,
		) => generateSellTransaction({ ...args, chainId: params.chainId }, config),
	});

	return {
		...result,
		generateSellTransaction: mutate,
		generateSellTransactionAsync: mutateAsync,
	};
};
