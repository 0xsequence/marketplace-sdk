import {
	type ChainId,
	ChainIdSchema,
	type GenerateListingTransactionArgs,
	getMarketplaceClient,
} from '@internal';
import { useMutation } from '@tanstack/react-query';
import type { SdkConfig, Step } from '@types';
import { z } from 'zod';
import {
	createReqSchema,
	generateListingTransactionArgsSchema,
	stepSchema,
} from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const CreateReqWithDateExpiry = createReqSchema.omit({ expiry: true }).extend({
	expiry: z.date(),
});

const GenerateListingTransactionPropsSchema =
	generateListingTransactionArgsSchema
		.omit({
			listing: true,
		})
		.extend({
			listing: CreateReqWithDateExpiry,
		});

const UserGenerateListingTransactionArgsSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	onSuccess: z.function().args(stepSchema.optional()).optional(),
});

export type UseGenerateListingTransactionArgs = z.infer<
	typeof UserGenerateListingTransactionArgsSchema
>;

export type GenerateListingTransactionProps = z.infer<
	typeof GenerateListingTransactionPropsSchema
>;

const dateToUnixTime = (date: Date) =>
	Math.floor(date.getTime() / 1000).toString();

export const generateListingTransaction = async (
	params: GenerateListingTransactionProps,
	config: SdkConfig,
	chainId: ChainId,
) => {
	const parsedChainId = ChainIdSchema.pipe(z.coerce.string()).parse(chainId);
	const parsedParams = GenerateListingTransactionPropsSchema.parse(params);
	const args = {
		...parsedParams,
		listing: {
			...parsedParams.listing,
			expiry: dateToUnixTime(parsedParams.listing.expiry),
		},
	} satisfies GenerateListingTransactionArgs;
	const marketplaceClient = getMarketplaceClient(parsedChainId, config);
	return (await marketplaceClient.generateListingTransaction(args)).steps;
};

export const useGenerateListingTransaction = (
	params: UseGenerateListingTransactionArgs,
) => {
	const parsedParams = UserGenerateListingTransactionArgsSchema.parse(params);
	const config = useConfig();
	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: parsedParams.onSuccess,
		mutationFn: (args: GenerateListingTransactionProps): Promise<Step[]> =>
			generateListingTransaction(args, config, parsedParams.chainId),
	});

	return {
		...result,
		generateListingTransaction: mutate,
		generateListingTransactionAsync: mutateAsync,
	};
};
