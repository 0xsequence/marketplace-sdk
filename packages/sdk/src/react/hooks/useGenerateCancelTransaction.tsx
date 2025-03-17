import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import type { ExecuteType, SdkConfig, Step, StepType } from '../../types';
import {
	type ChainId,
	ChainIdSchema,
	type GenerateCancelTransactionArgs,
	getMarketplaceClient,
} from '../_internal';
import { stepSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';
import { ChainId } from '@0xsequence/network';

const UserGenerateCancelTransactionArgsSchema: z.ZodObject<{
    chainId: z.ZodPipeline<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>, z.ZodString>;
    onSuccess: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodNativeEnum<StepType>;
        data: z.ZodString;
        to: z.ZodString;
        value: z.ZodString;
        signature: z.ZodOptional<z.ZodObject<{
            domain: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
                chainId: z.ZodNumber;
                verifyingContract: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            }, {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            }>;
            types: z.ZodAny;
            primaryType: z.ZodString;
            value: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        }, {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        }>>;
        post: z.ZodOptional<z.ZodObject<{
            endpoint: z.ZodString;
            method: z.ZodString;
            body: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            method: string;
            endpoint: string;
            body?: any;
        }, {
            method: string;
            endpoint: string;
            body?: any;
        }>>;
        executeType: z.ZodOptional<z.ZodNativeEnum<ExecuteType>>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        id: StepType;
        to: string;
        data: string;
        signature?: {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        } | undefined;
        executeType?: ExecuteType | undefined;
        post?: {
            method: string;
            endpoint: string;
            body?: any;
        } | undefined;
    }, {
        value: string;
        id: StepType;
        to: string;
        data: string;
        signature?: {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        } | undefined;
        executeType?: ExecuteType | undefined;
        post?: {
            method: string;
            endpoint: string;
            body?: any;
        } | undefined;
    }>, "many">>], z.ZodUnknown>, z.ZodUnknown>>;
}, "strip"> = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	onSuccess: z.function().args(stepSchema.array().optional()).optional(),
});

type UseGenerateCancelTransactionArgs = z.infer<
	typeof UserGenerateCancelTransactionArgsSchema
>;

export const generateCancelTransaction = async (
	args: GenerateCancelTransactionArgs,
	config: SdkConfig,
	chainId: ChainId,
): Promise<Step[]> => {
	const parsedChainId = ChainIdSchema.pipe(z.coerce.string()).parse(chainId);
	const marketplaceClient = getMarketplaceClient(parsedChainId, config);
	return marketplaceClient
		.generateCancelTransaction(args)
		.then((data) => data.steps);
};

export const useGenerateCancelTransaction = (
	params: UseGenerateCancelTransactionArgs,
): any => {
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
