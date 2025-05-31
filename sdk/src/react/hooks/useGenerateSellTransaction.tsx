import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	type GenerateSellTransactionArgs,
	getMarketplaceClient,
} from '../_internal';
import { stepSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UserGeneratSellTransactionArgsSchema = z.object({
	chainId: z.number(),
	onSuccess: z.function().args(stepSchema.array().optional()).optional(),
});

type UseGenerateSellTransactionArgs = z.infer<
	typeof UserGeneratSellTransactionArgsSchema
>;

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
		onSuccess: params.onSuccess,
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
