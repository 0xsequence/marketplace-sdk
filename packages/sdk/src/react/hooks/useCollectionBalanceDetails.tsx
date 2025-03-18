import type { GetTokenBalancesDetailsReturn } from '@0xsequence/indexer';
import type { ChainId } from '@0xsequence/network';
import { queryOptions, useQuery } from '@tanstack/react-query';
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

const filterSchema: z.ZodObject<
	{
		accountAddresses: z.ZodArray<
			z.ZodEffects<z.ZodString, Address, string>,
			'many'
		>;
		contractWhitelist: z.ZodOptional<
			z.ZodArray<z.ZodEffects<z.ZodString, Address, string>, 'many'>
		>;
		omitNativeBalances: z.ZodBoolean;
	},
	'strip'
> = z.object({
	accountAddresses: z.array(AddressSchema),
	contractWhitelist: z.array(AddressSchema).optional(),
	omitNativeBalances: z.boolean(),
});

const useCollectionBalanceDetailsArgsSchema: z.ZodObject<
	{
		chainId: z.ZodPipeline<
			z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
			z.ZodNumber
		>;
		filter: z.ZodObject<
			{
				accountAddresses: z.ZodArray<
					z.ZodEffects<z.ZodString, Address, string>,
					'many'
				>;
				contractWhitelist: z.ZodOptional<
					z.ZodArray<z.ZodEffects<z.ZodString, Address, string>, 'many'>
				>;
				omitNativeBalances: z.ZodBoolean;
			},
			'strip',
			z.ZodTypeAny,
			{
				accountAddresses: Address[];
				omitNativeBalances: boolean;
				contractWhitelist?: Address[] | undefined;
			},
			{
				accountAddresses: string[];
				omitNativeBalances: boolean;
				contractWhitelist?: string[] | undefined;
			}
		>;
		query: z.ZodOptional<
			z.ZodOptional<
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
			>
		>;
	},
	'strip'
> = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.number()),
	filter: filterSchema,
	query: QueryArgSchema.optional(),
});

export type CollectionBalanceFilter = z.infer<typeof filterSchema>;
export type UseCollectionBalanceDetailsArgs = z.input<
	typeof useCollectionBalanceDetailsArgsSchema
>;

const fetchCollectionBalanceDetails = async (
	args: UseCollectionBalanceDetailsArgs,
	indexerClient: Awaited<ReturnType<typeof getIndexerClient>>,
) => {
	const promises = args.filter.accountAddresses.map((accountAddress) =>
		indexerClient.getTokenBalancesDetails({
			filter: {
				accountAddresses: [accountAddress],
				contractWhitelist: args.filter.contractWhitelist,
				omitNativeBalances: args.filter.omitNativeBalances,
			},
		}),
	);

	const responses = await Promise.all(promises);
	const mergedResponse = responses.reduce<GetTokenBalancesDetailsReturn>(
		(acc, curr) => {
			if (!curr) return acc;
			return {
				page: curr.page,
				nativeBalances: [
					...(acc.nativeBalances || []),
					...(curr.nativeBalances || []),
				],
				balances: [...(acc.balances || []), ...(curr.balances || [])],
			};
		},
		{ page: {}, nativeBalances: [], balances: [] },
	);

	if (!mergedResponse) {
		throw new Error('Failed to fetch collection balance details');
	}

	return mergedResponse;
};

export const collectionBalanceDetailsOptions = (
	args: UseCollectionBalanceDetailsArgs,
	config: SdkConfig,
): any => {
	const parsedArgs = useCollectionBalanceDetailsArgsSchema.parse(args);
	const indexerClient = getIndexerClient(parsedArgs.chainId, config);

	return queryOptions({
		queryKey: [...balanceQueries.collectionBalanceDetails, args, config],
		queryFn: () => fetchCollectionBalanceDetails(parsedArgs, indexerClient),
		...args.query,
	});
};

export const useCollectionBalanceDetails = (
	args: UseCollectionBalanceDetailsArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(collectionBalanceDetailsOptions(args, config));
};
