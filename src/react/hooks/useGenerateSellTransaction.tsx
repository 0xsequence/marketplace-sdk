import {
	type ChainId,
	type GenerateSellTransactionArgs,
	getMarketplaceClient,
} from '@internal';
import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseGenerateSellTransactionArgs = {
	chainId: ChainId;
	onSuccess?: () => void | Promise<void>;
};

export const generateSellTransaction = async (
	args: GenerateSellTransactionArgs,
	config: SdkConfig,
	chainId: ChainId,
) => {
	console.log('generateSellTransaction');
	console.log(args);
	console.log(chainId);
	const marketplaceClient = getMarketplaceClient(chainId, config);
	return marketplaceClient.generateSellTransaction(args);
};

export const useGenerateSellTransaction = (
	params: UseGenerateSellTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateSellTransactionArgs) =>
			generateSellTransaction(args, config, params.chainId),
	});

	return {
		...result,
		generateSellTransaction: mutate,
		generateSellTransactionAsync: mutateAsync,
	};
};
