import { useMutation } from '@tanstack/react-query';
import type * as types from '../../../types';
import {
	type GenerateCancelTransactionRequest,
	getMarketplaceClient,
} from '../../_internal';
import type { Step } from '../../_internal/api/marketplace.gen';
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
) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient
		.generateCancelTransaction({ ...args, chainId: String(args.chainId) })
		.then((data) => data.steps);
};

export const useGenerateCancelTransaction = (
	params: UseGenerateCancelTransactionRequest,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateCancelTransactionRequestWithNumberChainId) =>
			generateCancelTransaction(args, config),
	});

	return {
		...result,
		generateCancelTransaction: mutate,
		generateCancelTransactionAsync: mutateAsync,
	};
};
