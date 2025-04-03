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

export const generateSellTransaction = async (
	args: GenerateSellTransactionArgs,
	config: SdkConfig,
	chainId: number,
) => {
	const marketplaceClient = getMarketplaceClient(chainId, config);
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
