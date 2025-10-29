import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types/index';
import {
	type GenerateSellTransactionRequest,
	getMarketplaceClient,
} from '../../_internal';
import type { Step } from '../../_internal/api/marketplace.gen';
import { useConfig } from '../config/useConfig';

interface UseGenerateSellTransactionRequest {
	chainId: number;
	onSuccess?: (steps?: Step[]) => void;
}

type GenerateSellTransactionRequestWithNumberChainId = Omit<
	GenerateSellTransactionRequest,
	'chainId'
> & { chainId: number };

export const generateSellTransaction = async (
	args: GenerateSellTransactionRequestWithNumberChainId,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	const argsWithStringChainId = {
		...args,
		chainId: String(args.chainId),
	} satisfies GenerateSellTransactionRequest;
	return marketplaceClient
		.generateSellTransaction(argsWithStringChainId)
		.then((data) => data.steps);
};

export const useGenerateSellTransaction = (
	params: UseGenerateSellTransactionRequest,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (
			args: Omit<GenerateSellTransactionRequestWithNumberChainId, 'chainId'>,
		) => generateSellTransaction({ ...args, chainId: params.chainId }, config),
	});

	return {
		...result,
		generateSellTransaction: mutate,
		generateSellTransactionAsync: mutateAsync,
	};
};
