import type { Step } from '@0xsequence/api-client';
import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types/index';
import {
	type GenerateSellTransactionRequest,
	getMarketplaceClient,
} from '../../_internal';
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
): Promise<Step[]> => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient
		.generateSellTransaction(args)
		.then((data) => data.steps);
};

export const useGenerateSellTransaction = (
	params: UseGenerateSellTransactionRequest,
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
			args: Omit<GenerateSellTransactionRequestWithNumberChainId, 'chainId'>,
		) => generateSellTransaction({ ...args, chainId: params.chainId }, config),
	});

	return {
		...result,
		generateSellTransaction: mutate,
		generateSellTransactionAsync: mutateAsync,
	};
};
