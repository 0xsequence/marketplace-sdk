import { useMutation } from '@tanstack/react-query';
import type * as types from '../../../types';
import {
	type GenerateCancelTransactionArgs,
	getMarketplaceClient,
} from '../../_internal';
import type { Step } from '../../_internal/api/marketplace.gen';
import { useConfig } from '../config/useConfig';

// Create a type that uses number for chainId
type GenerateCancelTransactionArgsWithNumberChainId = Omit<
	GenerateCancelTransactionArgs,
	'chainId'
> & {
	chainId: number;
};

interface UseGenerateCancelTransactionArgs {
	chainId: number;
	onSuccess?: (steps?: Step[]) => void;
}

export const generateCancelTransaction = async (
	args: GenerateCancelTransactionArgsWithNumberChainId,
	config: types.SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient
		.generateCancelTransaction({ ...args, chainId: String(args.chainId) })
		.then((data) => data.steps);
};

export const useGenerateCancelTransaction = (
	params: UseGenerateCancelTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateCancelTransactionArgsWithNumberChainId) =>
			generateCancelTransaction(args, config),
	});

	return {
		...result,
		generateCancelTransaction: mutate,
		generateCancelTransactionAsync: mutateAsync,
	};
};
