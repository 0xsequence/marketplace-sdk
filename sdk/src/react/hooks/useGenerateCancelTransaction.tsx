import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	type GenerateCancelTransactionArgs,
	getMarketplaceClient,
} from '../_internal';
import { stepSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

// Create a type that uses number for chainId
type GenerateCancelTransactionArgsWithNumberChainId = Omit<
	GenerateCancelTransactionArgs,
	'chainId'
> & {
	chainId: number;
};

const UserGenerateCancelTransactionArgsSchema = z.object({
	chainId: z.number(),
	onSuccess: z.function().args(stepSchema.array().optional()).optional(),
});

type UseGenerateCancelTransactionArgs = z.infer<
	typeof UserGenerateCancelTransactionArgsSchema
>;

export const generateCancelTransaction = async (
	args: GenerateCancelTransactionArgsWithNumberChainId,
	config: SdkConfig,
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
