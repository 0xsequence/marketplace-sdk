import type { GetTokenBalancesDetailsReturn } from '@0xsequence/indexer';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	balanceQueries,
	getIndexerClient,
	QueryArgSchema,
} from '../_internal';
import { useConfig } from './useConfig';

const filterSchema = z.object({
	accountAddresses: z.array(AddressSchema),
	contractWhitelist: z.array(AddressSchema).optional(),
	omitNativeBalances: z.boolean(),
});

const useCollectionBalanceDetailsArgsSchema = z.object({
	chainId: z.number(),
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
) => {
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
) => {
	const config = useConfig();
	return useQuery(collectionBalanceDetailsOptions(args, config));
};
