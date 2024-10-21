import {
	type ChainId,
	type GenerateOfferTransactionArgs,
	getMarketplaceClient,
} from '@internal';
import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseGenerateOfferTransactionArgs = {
	chainId: ChainId;
};

export const generateOfferTransaction = async (
	args: GenerateOfferTransactionArgs,
	config: SdkConfig,
	chainId: ChainId,
) => {
	console.log('generateOfferTransaction');
	console.log(args);
	console.log(chainId);
	const marketplaceClient = getMarketplaceClient(chainId, config);
	return marketplaceClient.generateOfferTransaction(args);
};

export const useGenerateOfferTransaction = (
	params: UseGenerateOfferTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		mutationFn: (args: GenerateOfferTransactionArgs) =>
			generateOfferTransaction(args, config, params.chainId),
	});

	return {
		...result,
		isSuccsess: result.isSuccess, // TODO: Add types so this can be removed
		generateOfferTransaction: mutate,
		generateOfferTransactionAsync: mutateAsync,
	};
};
