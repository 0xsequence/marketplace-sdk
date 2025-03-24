import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	type ChainId,
	ChainIdSchema,
	type GenerateSellTransactionArgs,
	getMarketplaceClient,
} from '../_internal';
import { stepSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UserGeneratSellTransactionArgsSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	onSuccess: z.function().args(stepSchema.array().optional()).optional(),
});

type UseGenerateSellTransactionArgs = z.infer<
	typeof UserGeneratSellTransactionArgsSchema
>;

export const generateSellTransaction = async (
	args: GenerateSellTransactionArgs,
	config: SdkConfig,
	chainId: ChainId,
) => {
	const parsedChainId = ChainIdSchema.pipe(z.coerce.string()).parse(chainId);
	const marketplaceClient = getMarketplaceClient(parsedChainId, config);
	return marketplaceClient
		.generateSellTransaction(args)
		.then((data) => data.steps);
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
