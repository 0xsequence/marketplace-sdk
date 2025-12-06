import type { Step } from '@0xsequence/api-client';
import { useMutation } from '@tanstack/react-query';
import type * as types from '../../../types';
import {
	type GenerateCancelTransactionRequest,
	getMarketplaceClient,
} from '../../_internal';
import { useConfig } from '../config/useConfig';

// Create a type that uses number for chainId
type GenerateCancelTransactionRequestWithNumberChainId = Omit<
	GenerateCancelTransactionRequest,
	'chainId'
> & {
	chainId: number;
};

interface UseGenerateCancelTransactionRequest {
	chainId: number;
	onSuccess?: (steps?: Step[]) => void;
}

export const generateCancelTransaction = async (
	args: GenerateCancelTransactionRequestWithNumberChainId,
	config: types.SdkConfig,
): Promise<Step[]> => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient
		.generateCancelTransaction(args)
		.then((data) => data.steps);
};

export const useGenerateCancelTransaction = (
	params: UseGenerateCancelTransactionRequest,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: (data) => {
			// Only pass the data (steps) to the user's onSuccess callback to maintain backwards compatibility
			if (params.onSuccess) {
				params.onSuccess(data);
			}
		},
		mutationFn: (args: GenerateCancelTransactionRequestWithNumberChainId) =>
			generateCancelTransaction(args, config),
	});

	return {
		...result,
		generateCancelTransaction: mutate,
		generateCancelTransactionAsync: mutateAsync,
	};
};
