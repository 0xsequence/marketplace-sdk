import type { GetTokenBalancesDetailsReturn } from '@0xsequence/indexer';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import type { QueryArg } from '../_internal';
import { balanceQueries, getIndexerClient } from '../_internal';
import { useConfig } from './useConfig';

export interface CollectionBalanceFilter {
	accountAddresses: Address[];
	contractWhitelist?: Address[];
	omitNativeBalances: boolean;
}

export interface UseCollectionBalanceDetailsArgs {
	chainId: number;
	filter: CollectionBalanceFilter;
	query?: QueryArg;
}

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
		(
			acc: GetTokenBalancesDetailsReturn,
			curr: GetTokenBalancesDetailsReturn | null,
		) => {
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
	const indexerClient = getIndexerClient(args.chainId, config);

	return queryOptions({
		queryKey: [...balanceQueries.collectionBalanceDetails, args, config],
		queryFn: () => fetchCollectionBalanceDetails(args, indexerClient),
		...(args.query || {}),
	});
};

export const useCollectionBalanceDetails = (
	args: UseCollectionBalanceDetailsArgs,
) => {
	const config = useConfig();
	return useQuery(collectionBalanceDetailsOptions(args, config));
};
