import {
	type GetTokenBalancesReturn,
	type Page,
	SortOrder,
} from '@0xsequence/indexer';
import type { ChainId } from '@0xsequence/network';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	balanceQueries,
	getIndexerClient,
} from '../_internal';
import { useConfig } from './useConfig';

export const metadataOptionsSchema: z.ZodObject<
	{
		verifiedOnly: z.ZodOptional<z.ZodBoolean>;
		unverifiedOnly: z.ZodOptional<z.ZodBoolean>;
		includeContracts: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
	},
	'strip'
> = z.object({
	verifiedOnly: z.boolean().optional(),
	unverifiedOnly: z.boolean().optional(),
	includeContracts: z.array(z.string()).optional(),
});

const sortOrderSchema = z.nativeEnum(SortOrder);

const sortBySchema = z.object({
	column: z.string(),
	order: sortOrderSchema,
});

const pageSchema = z.object({
	page: z.number().optional(),
	column: z.string().optional(),
	before: z.any().optional(),
	after: z.any().optional(),
	sort: z.array(sortBySchema).optional(),
	pageSize: z.number().optional(),
	more: z.boolean().optional(),
});

const useListBalancesArgsSchema: z.ZodObject<
	{
		chainId: z.ZodPipeline<
			z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
			z.ZodNumber
		>;
		accountAddress: z.ZodOptional<z.ZodEffects<z.ZodString, Address, string>>;
		contractAddress: z.ZodOptional<z.ZodEffects<z.ZodString, Address, string>>;
		tokenId: z.ZodOptional<z.ZodString>;
		includeMetadata: z.ZodOptional<z.ZodBoolean>;
		metadataOptions: z.ZodOptional<
			z.ZodObject<
				{
					verifiedOnly: z.ZodOptional<z.ZodBoolean>;
					unverifiedOnly: z.ZodOptional<z.ZodBoolean>;
					includeContracts: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
				},
				'strip',
				z.ZodTypeAny,
				{
					verifiedOnly?: boolean | undefined;
					unverifiedOnly?: boolean | undefined;
					includeContracts?: string[] | undefined;
				},
				{
					verifiedOnly?: boolean | undefined;
					unverifiedOnly?: boolean | undefined;
					includeContracts?: string[] | undefined;
				}
			>
		>;
		includeCollectionTokens: z.ZodOptional<z.ZodBoolean>;
		page: z.ZodOptional<
			z.ZodObject<
				{
					page: z.ZodOptional<z.ZodNumber>;
					column: z.ZodOptional<z.ZodString>;
					before: z.ZodOptional<z.ZodAny>;
					after: z.ZodOptional<z.ZodAny>;
					sort: z.ZodOptional<
						z.ZodArray<
							z.ZodObject<
								{
									column: z.ZodString;
									order: z.ZodNativeEnum<typeof SortOrder>;
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
					pageSize: z.ZodOptional<z.ZodNumber>;
					more: z.ZodOptional<z.ZodBoolean>;
				},
				'strip',
				z.ZodTypeAny,
				{
					page?: number | undefined;
					sort?:
						| {
								order: SortOrder;
								column: string;
						  }[]
						| undefined;
					column?: string | undefined;
					pageSize?: number | undefined;
					more?: boolean | undefined;
					before?: any;
					after?: any;
				},
				{
					page?: number | undefined;
					sort?:
						| {
								order: SortOrder;
								column: string;
						  }[]
						| undefined;
					column?: string | undefined;
					pageSize?: number | undefined;
					more?: boolean | undefined;
					before?: any;
					after?: any;
				}
			>
		>;
		query: z.ZodOptional<
			z.ZodObject<
				{
					enabled: z.ZodOptional<z.ZodBoolean>;
				},
				'strip',
				z.ZodTypeAny,
				{
					enabled?: boolean | undefined;
				},
				{
					enabled?: boolean | undefined;
				}
			>
		>;
	},
	'strip'
> = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.number()),
	accountAddress: AddressSchema.optional(),
	contractAddress: AddressSchema.optional(),
	tokenId: z.string().optional(),
	includeMetadata: z.boolean().optional(),
	metadataOptions: metadataOptionsSchema.optional(),
	includeCollectionTokens: z.boolean().optional(),
	page: pageSchema.optional(),
	query: QueryArgSchema,
});

export type UseFetchTokenBalancesReturn = Awaited<
	ReturnType<typeof fetchBalances>
>;

export type UseListBalancesArgs = z.input<typeof useListBalancesArgsSchema>;

const fetchBalances = async (
	args: UseListBalancesArgs,
	config: SdkConfig,
	page: Page,
): Promise<GetTokenBalancesReturn> => {
	const parsedArgs = useListBalancesArgsSchema.parse(args);
	const indexerClient = getIndexerClient(parsedArgs.chainId, config);

	return indexerClient.getTokenBalances({
		...parsedArgs,
		tokenID: parsedArgs.tokenId,
		page: page,
	});
};

export const listBalancesOptions = (
	args: UseListBalancesArgs,
	config: SdkConfig,
): any => {
	return infiniteQueryOptions({
		...args.query,
		queryKey: [...balanceQueries.lists, args, config],
		queryFn: ({ pageParam }) => fetchBalances(args, config, pageParam),
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage: { page: { after: any } }) =>
			lastPage.page.after,
	});
};

export const useListBalances = (
	args: UseListBalancesArgs,
): DefinedInfiniteQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useInfiniteQuery(listBalancesOptions(args, config));
};
