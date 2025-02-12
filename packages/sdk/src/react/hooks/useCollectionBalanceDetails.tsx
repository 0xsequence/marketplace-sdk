import { z } from 'zod';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	balanceQueries,
	getIndexerClient,
} from '../_internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useConfig } from './useConfig';
import { ContractVerificationStatus } from '@0xsequence/indexer';
import type { SdkConfig } from '../../types';

const filterSchema = z.object({
	accountAddresses: z.array(AddressSchema),
	contractWhitelist: z.array(z.string()).optional(),
	contractBlacklist: z.array(z.string()).optional(),
	contractStatus: z.nativeEnum(ContractVerificationStatus).optional(),
	omitNativeBalances: z.boolean(),
});

const useCollectionBalanceDetailsArgsSchema = z.object({
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
				contractWhitelist: args.filter.contractWhitelist ?? [],
				contractBlacklist: args.filter.contractBlacklist ?? [],
				contractStatus: args.filter.contractStatus,
				omitNativeBalances: args.filter.omitNativeBalances,
			},
		}),
	);

	const responses = await Promise.all(promises);
	const mergedResponse = responses.reduce(
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
