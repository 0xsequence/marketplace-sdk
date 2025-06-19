import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import {
	getMarketplaceClient,
	type ListPrimarySaleItemsArgs,
	type ListPrimarySaleItemsReturn,
	type Page,
	type PrimarySaleItemsFilter,
} from '../_internal';
import { useConfig } from './useConfig';

interface UseListPrimarySaleItemsArgs {
	chainId: number;
	primarySaleContractAddress: Address | undefined;
	filter?: PrimarySaleItemsFilter;
	page?: Page;
	query?: {
		enabled?: boolean;
	};
}

const fetchListPrimarySaleItems = async (
	args: ListPrimarySaleItemsArgs,
	config: SdkConfig,
): Promise<ListPrimarySaleItemsReturn> => {
	const arg = {
		chainId: String(args.chainId),
		primarySaleContractAddress: args.primarySaleContractAddress,
		filter: args.filter,
		page: args.page,
	} satisfies ListPrimarySaleItemsArgs;

	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listPrimarySaleItems(arg);
};

const listPrimarySaleItemsOptions = (
	args: UseListPrimarySaleItemsArgs,
	config: SdkConfig,
) => {
	const primarySaleContractAddress = args.primarySaleContractAddress as Address;
	return {
		queryKey: ['listPrimarySaleItems', args],
		queryFn: async ({ pageParam }: { pageParam: Page }) => {
			return fetchListPrimarySaleItems(
				{
					chainId: String(args.chainId),
					primarySaleContractAddress,
					filter: args.filter,
					page: pageParam,
				},
				config,
			);
		},
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage: ListPrimarySaleItemsReturn) =>
			lastPage.page?.more
				? {
						page: lastPage.page?.page || 1,
						pageSize: lastPage.page?.pageSize || 30,
					}
				: undefined,
		...args.query,
		enabled: !!primarySaleContractAddress && args.query?.enabled !== false,
	};
};

export const useListPrimarySaleItems = (args: UseListPrimarySaleItemsArgs) => {
	const config = useConfig();
	return useInfiniteQuery(listPrimarySaleItemsOptions(args, config));
};

interface UseGetCountOfPrimarySaleItemsArgs {
	chainId: number;
	primarySaleContractAddress: Address | undefined;
	filter?: PrimarySaleItemsFilter;
	query?: {
		enabled?: boolean;
	};
}

export const useGetCountOfPrimarySaleItems = (
	args: UseGetCountOfPrimarySaleItemsArgs,
) => {
	const config = useConfig();

	return useQuery({
		queryKey: ['getCountOfPrimarySaleItems', args],
		queryFn: async () => {
			const marketplaceClient = getMarketplaceClient(config);

			return marketplaceClient.getCountOfPrimarySaleItems({
				chainId: String(args.chainId),
				primarySaleContractAddress: args.primarySaleContractAddress || '',
				filter: args.filter,
			});
		},
		...args.query,
		enabled: !!args.primarySaleContractAddress && args.query?.enabled !== false,
	});
};
