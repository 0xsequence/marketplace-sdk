import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { MarketplaceKind, SdkConfig, SortOrder } from '../../types';
import {
	ChainIdSchema,
	ListCollectibleOffersReturn,
	type ListOffersForCollectibleArgs,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { listOffersForCollectibleArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';
import { ChainId } from '@0xsequence/network';

const UseListOffersForCollectibleArgsSchema: z.ZodObject<Omit<z.objectUtil.extendShape<{
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
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, {
    chainId: z.ZodPipeline<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>, z.ZodString>;
    collectionAddress: z.ZodString;
    collectibleId: z.ZodString;
}>, "tokenId" | "contractAddress">, "strip"> = listOffersForCollectibleArgsSchema
	.extend({
		chainId: ChainIdSchema.pipe(z.coerce.string()),
		collectionAddress: z.string(),
		collectibleId: z.string(),
	})
	.omit({ contractAddress: true, tokenId: true });

type UseListOffersForCollectibleArgs = z.infer<
	typeof UseListOffersForCollectibleArgsSchema
>;

export type UseListOffersForCollectibleReturn = Awaited<
	ReturnType<typeof fetchListOffersForCollectible>
>;

const fetchListOffersForCollectible = async (
	config: SdkConfig,
	args: UseListOffersForCollectibleArgs,
): Promise<ListCollectibleOffersReturn> => {
	const arg = {
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
		page: args.page,
	} satisfies ListOffersForCollectibleArgs;

	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.listCollectibleOffers(arg);
};

export const listOffersForCollectibleOptions = (
	args: UseListOffersForCollectibleArgs,
	config: SdkConfig,
): any => {
	return queryOptions({
		queryKey: [...collectableKeys.offers, args, config],
		queryFn: () => fetchListOffersForCollectible(config, args),
	});
};

export const useListOffersForCollectible = (
	args: UseListOffersForCollectibleArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();

	return useQuery(listOffersForCollectibleOptions(args, config));
};
