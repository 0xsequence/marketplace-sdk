import {
	type ChainId,
	ChainIdSchema,
	type GenerateOfferTransactionArgs,
	getMarketplaceClient,
} from '@internal';
import { useMutation } from '@tanstack/react-query';
import type { SdkConfig, Step } from '@types';
import { z } from 'zod';
import {
	createReqSchema,
	generateOfferTransactionArgsSchema,
	stepSchema,
} from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const CreateReqWithDateExpiry = createReqSchema.omit({ expiry: true }).extend({
	expiry: z.date(),
});

const GenerateOfferTransactionPropsSchema = generateOfferTransactionArgsSchema
	.omit({
		offer: true,
	})
	.extend({
		offer: CreateReqWithDateExpiry,
	});

const UserGenerateOfferTransactionArgsSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	onSuccess: z.function().args(stepSchema.array().optional()).optional(),
});

export type UseGenerateOfferTransactionArgs = z.infer<
	typeof UserGenerateOfferTransactionArgsSchema
>;

export type GenerateOfferTransactionProps = {
	chainId: ChainId;
	onSuccess?: (steps?: Step[]) => void;
};

const dateToUnixTime = (date: Date) =>
	Math.floor(date.getTime() / 1000).toString();

export const generateOfferTransaction = async (
	params: GenerateOfferTransactionProps,
	config: SdkConfig,
	chainId: ChainId,
) => {
	const parsedChainId = ChainIdSchema.pipe(z.coerce.string()).parse(chainId);
	const parsedParams = GenerateOfferTransactionPropsSchema.parse(params);
	const args = {
		...parsedParams,
		offer: {
			...parsedParams.offer,
			expiry: dateToUnixTime(parsedParams.offer.expiry),
		},
	} satisfies GenerateOfferTransactionArgs;
	const marketplaceClient = getMarketplaceClient(parsedChainId, config);
	return (await marketplaceClient.generateOfferTransaction(args)).steps;
};

export const useGenerateOfferTransaction = (
	params: UseGenerateOfferTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateOfferTransactionProps) =>
			generateOfferTransaction(args, config, params.chainId),
	});

	return {
		...result,
		generateOfferTransaction: mutate,
		generateOfferTransactionAsync: mutateAsync,
	};
};
