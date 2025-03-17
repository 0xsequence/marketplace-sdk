import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { MarketplaceKind, SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	GetCountOfListingsForCollectibleReturn,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { countListingsForCollectibleArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';
import { ChainId } from '@0xsequence/network';

const UseCountListingsForCollectibleArgsSchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "tokenId" | "contractAddress">, {
    collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
    collectibleId: z.ZodString;
    chainId: z.ZodPipeline<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>, z.ZodString>;
    query: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>>;
}>, "strip"> =
	countListingsForCollectibleArgsSchema
		.omit({
			contractAddress: true,
			tokenId: true,
		})
		.extend({
			collectionAddress: AddressSchema,
			collectibleId: z.string(),
			chainId: ChainIdSchema.pipe(z.coerce.string()),
			query: QueryArgSchema,
		});

export type UseCountListingsForCollectibleArgs = z.infer<
	typeof UseCountListingsForCollectibleArgsSchema
>;

export type UseCountListingsForCollectibleReturn = Awaited<
	ReturnType<typeof fetchCountListingsForCollectible>
>;

const fetchCountListingsForCollectible = async (
	args: UseCountListingsForCollectibleArgs,
	config: SdkConfig,
): Promise<GetCountOfListingsForCollectibleReturn> => {
	const parsedArgs = UseCountListingsForCollectibleArgsSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
	return marketplaceClient.getCountOfListingsForCollectible({
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
		tokenId: parsedArgs.collectibleId,
	});
};

export const countListingsForCollectibleOptions = (
	args: UseCountListingsForCollectibleArgs,
	config: SdkConfig,
): any => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.listingsCount, args, config],
		queryFn: () => fetchCountListingsForCollectible(args, config),
	});
};

export const useCountListingsForCollectible = (
	args: UseCountListingsForCollectibleArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(countListingsForCollectibleOptions(args, config));
};
