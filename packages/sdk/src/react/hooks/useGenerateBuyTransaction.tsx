import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { z } from 'zod';
import type { SdkConfig, Step } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	MarketplaceKind,
	QueryArgSchema,
	WalletKind,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { ChainId } from '@0xsequence/network';

export const UseGenerateBuyTransactionArgsSchema: z.ZodObject<{
    chainId: z.ZodPipeline<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>, z.ZodString>;
    collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
    marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
    ordersData: z.ZodArray<z.ZodObject<{
        orderId: z.ZodString;
        quantity: z.ZodString;
        marketplace: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: string;
        quantity: string;
    }, {
        orderId: string;
        marketplace: string;
        quantity: string;
    }>, "many">;
    walletType: z.ZodOptional<z.ZodNativeEnum<typeof WalletKind>>;
    query: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	marketplace: z.nativeEnum(MarketplaceKind),
	ordersData: z.array(
		z.object({
			orderId: z.string(),
			quantity: z.string(),
			marketplace: z.string(),
		}),
	),
	walletType: z.nativeEnum(WalletKind).optional(),
	query: QueryArgSchema,
});

type UseGenerateBuyTransactionArgs = z.infer<
	typeof UseGenerateBuyTransactionArgsSchema
>;

export const fetchGenerateBuyTransaction = async (
	args: UseGenerateBuyTransactionArgs & { buyer: Hex },
	config: SdkConfig,
): Promise<Step[]> => {
	const parsedArgs = UseGenerateBuyTransactionArgsSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);

	return marketplaceClient
		.generateBuyTransaction({
			...parsedArgs,
			buyer: args.buyer,
			additionalFees: [], // TODO: Add additional fees
		})
		.then((data) => data.steps);
};

export const generateBuyTransactionOptions = (
	args: UseGenerateBuyTransactionArgs & { buyer: Hex },
	config: SdkConfig,
): any => {
	return queryOptions({
		queryKey: ['generateBuyTransaction', args],
		queryFn: () => fetchGenerateBuyTransaction(args, config),
		...args.query,
	});
};

export const useGenerateBuyTransaction = (
	args: UseGenerateBuyTransactionArgs,
): QueryObserverResult<TData, TError> => {
	const { address } = useAccount();
	const config = useConfig();

	return useQuery({
		queryKey: ['generateBuyTransaction', args],
		queryFn: address
			? () => {
					return fetchGenerateBuyTransaction(
						{ buyer: address, ...args },
						config,
					);
				}
			: skipToken,
	});
};
