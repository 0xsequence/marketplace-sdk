import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { MarketplaceKind, SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	GetCollectibleLowestListingReturn,
	QueryArgSchema,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { getCollectibleLowestListingArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';
import { ChainId } from '@0xsequence/network';

const UseLowestListingSchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filters: z.ZodOptional<z.ZodObject<{
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
}, "contractAddress">, {
    collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
    chainId: z.ZodPipeline<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>, z.ZodString>;
    query: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>>;
}>, "strip"> = getCollectibleLowestListingArgsSchema
	.omit({
		contractAddress: true,
	})
	.extend({
		collectionAddress: AddressSchema,
		chainId: ChainIdSchema.pipe(z.coerce.string()),
		query: QueryArgSchema,
	});

export type UseLowestListingArgs = z.infer<typeof UseLowestListingSchema>;

export type UseLowestListingReturn = Awaited<
	ReturnType<typeof fetchLowestListing>
>;

const fetchLowestListing = async (
	args: UseLowestListingArgs,
	config: SdkConfig,
): Promise<GetCollectibleLowestListingReturn> => {
	const parsedArgs = UseLowestListingSchema.parse(args);
	const marketplaceClient = getMarketplaceClient(parsedArgs.chainId, config);
	return marketplaceClient.getCollectibleLowestListing({
		...parsedArgs,
		contractAddress: parsedArgs.collectionAddress,
	});
};

export const lowestListingOptions = (
	args: UseLowestListingArgs,
	config: SdkConfig,
): any => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.lowestListings, args, config],
		queryFn: () => fetchLowestListing(args, config),
	});
};

export const useLowestListing = (args: UseLowestListingArgs): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(lowestListingOptions(args, config));
};
