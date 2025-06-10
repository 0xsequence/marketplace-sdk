import { useInfiniteQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	type ListPrimarySaleItemsArgs,
	type ListPrimarySaleItemsReturn,
	type Page,
	type PrimarySaleItemsFilter,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';

type UseListPrimarySaleItemsArgs = {
	chainId: number;
	primarySaleContractAddress: string;
	filter?: PrimarySaleItemsFilter;
	query?: {
		enabled?: boolean;
	};
};

const fetchListPrimarySaleItems = async (
	config: SdkConfig,
	args: ListPrimarySaleItemsArgs,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listPrimarySaleItems(args);
};

export const listPrimarySaleItemsOptions = (
	args: UseListPrimarySaleItemsArgs,
	config: SdkConfig,
) => {
	return {
		queryKey: ['primarySaleItems', args, config],
		queryFn: async ({ pageParam }: { pageParam: Page }) => {
			return fetchListPrimarySaleItems(config, {
				chainId: String(args.chainId),
				primarySaleContractAddress: args.primarySaleContractAddress,
				filter: args.filter,
				page: pageParam,
			});
		},
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage: ListPrimarySaleItemsReturn) =>
			lastPage.page?.more
				? {
						page: (lastPage.page?.page || 1) + 1,
						pageSize: lastPage.page?.pageSize || 30,
					}
				: undefined,
		enabled: args.query?.enabled ?? true,
	};
};

export const useListPrimarySaleItems = (args: UseListPrimarySaleItemsArgs) => {
	const config = useConfig();

	return useInfiniteQuery(listPrimarySaleItemsOptions(args, config));
};
