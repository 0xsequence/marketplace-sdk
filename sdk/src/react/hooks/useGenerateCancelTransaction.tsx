import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	type ChainId,
	type GenerateCancelTransactionArgs,
	getMarketplaceClient,
} from '../_internal';
import { stepSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UserGenerateCancelTransactionArgsSchema = z.object({
	chainId: z.number(),
	onSuccess: z.function().args(stepSchema.array().optional()).optional(),
});

type UseGenerateCancelTransactionArgs = z.infer<
	typeof UserGenerateCancelTransactionArgsSchema
>;

export const generateCancelTransaction = async (
	args: GenerateCancelTransactionArgs,
	config: SdkConfig,
	chainId: ChainId,
) => {
	const parsedChainId = ChainIdSchema.pipe(z.coerce.string()).parse(chainId);
	const marketplaceClient = getMarketplaceClient(parsedChainId, config);
	return marketplaceClient
		.generateCancelTransaction(args)
		.then((data) => data.steps);
};

export const useGenerateCancelTransaction = (
	params: UseGenerateCancelTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateCancelTransactionArgs) =>
			generateCancelTransaction(args, config, params.chainId),
	});

	return {
		...result,
		generateCancelTransaction: mutate,
		generateCancelTransactionAsync: mutateAsync,
	};
};
