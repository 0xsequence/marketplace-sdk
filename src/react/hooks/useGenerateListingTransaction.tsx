import {
	type ChainId,
	type GenerateListingTransactionArgs,
	getMarketplaceClient,
} from '@internal';
import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseGenerateListingTransactionArgs = {
	chainId: ChainId;
};

const generateListingTransaction = async (
	args: GenerateListingTransactionArgs,
	config: SdkConfig,
	chainId: ChainId,
) => {
	const marketplaceClient = getMarketplaceClient(chainId, config);
	return marketplaceClient.generateListingTransaction(args);
};

export const generateListingOptions = (chainId: ChainId, config: SdkConfig) => {
	return {
		mutationKey: ['generateListingTransaction'],
		mutationFn: (args: GenerateListingTransactionArgs) =>
			generateListingTransaction(args, config, chainId),
	};
};

export const useGenerateListingTransaction = (
	args: UseGenerateListingTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation(
		generateListingOptions(args.chainId, config),
	);

	return {
		...result,
		generateListingTransaction: mutate,
		generateListingTransactionAsync: mutateAsync,
	};
};
