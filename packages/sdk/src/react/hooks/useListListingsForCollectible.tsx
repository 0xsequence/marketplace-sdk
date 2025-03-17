import type { ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { MarketplaceKind, SdkConfig, SortOrder } from '../../types';
import {
	ChainIdSchema,
	type ListCollectibleListingsReturn,
	type ListListingsForCollectibleArgs,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';
import { listListingsForCollectibleArgsSchema } from '../_internal/api/zod-schema';
import { useConfig } from './useConfig';

const UseListListingsForCollectibleArgsSchema: z.ZodObject<
	Omit<
		z.objectUtil.extendShape<
			{
				contractAddress: z.ZodString;
				tokenId: z.ZodString;
				filter: z.ZodOptional<
					z.ZodObject<
						{
							createdBy: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
							marketplace: z.ZodOptional<
								z.ZodArray<z.ZodNativeEnum<MarketplaceKind>, 'many'>
							>;
							currencies: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
						},
						'strip',
						z.ZodTypeAny,
						{
							currencies?: string[] | undefined;
							marketplace?: MarketplaceKind[] | undefined;
							createdBy?: string[] | undefined;
						},
						{
							currencies?: string[] | undefined;
							marketplace?: MarketplaceKind[] | undefined;
							createdBy?: string[] | undefined;
						}
					>
				>;
				page: z.ZodOptional<
					z.ZodObject<
						{
							page: z.ZodNumber;
							pageSize: z.ZodNumber;
							more: z.ZodOptional<z.ZodBoolean>;
							sort: z.ZodOptional<
								z.ZodArray<
									z.ZodObject<
										{
											column: z.ZodString;
											order: z.ZodNativeEnum<SortOrder>;
										},
										'strip',
										z.ZodTypeAny,
										{
											order: SortOrder;
											column: string;
										},
										{
											order: SortOrder;
											column: string;
										}
									>,
									'many'
								>
							>;
						},
						'strip',
						z.ZodTypeAny,
						{
							page: number;
							pageSize: number;
							sort?:
								| {
										order: SortOrder;
										column: string;
								  }[]
								| undefined;
							more?: boolean | undefined;
						},
						{
							page: number;
							pageSize: number;
							sort?:
								| {
										order: SortOrder;
										column: string;
								  }[]
								| undefined;
							more?: boolean | undefined;
						}
					>
				>;
			},
			{
				chainId: z.ZodPipeline<
					z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
					z.ZodString
				>;
				collectionAddress: z.ZodString;
				collectibleId: z.ZodString;
			}
		>,
		'tokenId' | 'contractAddress'
	>,
	'strip'
> = listListingsForCollectibleArgsSchema
	.extend({
		chainId: ChainIdSchema.pipe(z.coerce.string()),
		collectionAddress: z.string(),
		collectibleId: z.string(),
	})
	.omit({ contractAddress: true, tokenId: true });

type UseListListingsForCollectibleArgs = z.infer<
	typeof UseListListingsForCollectibleArgsSchema
>;

export type UseListListingsForCollectibleReturn = Awaited<
	ReturnType<typeof fetchListListingsForCollectible>
>;

const fetchListListingsForCollectible = async (
	config: SdkConfig,
	args: UseListListingsForCollectibleArgs,
): Promise<ListCollectibleListingsReturn> => {
	const arg = {
		contractAddress: args.collectionAddress,
		tokenId: args.collectibleId,
		filter: args.filter,
		page: args.page,
	} satisfies ListListingsForCollectibleArgs;

	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return marketplaceClient.listCollectibleListings(arg);
};

export const listListingsForCollectibleOptions = (
	args: UseListListingsForCollectibleArgs,
	config: SdkConfig,
): any => {
	return queryOptions({
		queryKey: [...collectableKeys.listings, args, config],
		queryFn: () => fetchListListingsForCollectible(config, args),
	});
};

export const useListListingsForCollectible = (
	args: UseListListingsForCollectibleArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();

	return useQuery(listListingsForCollectibleOptions(args, config));
};
