import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import {
	getMarketplaceClient,
	type ListPrimarySaleItemsArgs,
	type ListPrimarySaleItemsReturn,
	type Page,
	type PrimarySaleItemsFilter,
} from '../_internal';

export type ListPrimarySaleItemsQueryOptions = {
	chainId: number;
	primarySaleContractAddress: Address | undefined;
	filter?: PrimarySaleItemsFilter;
	page?: Page;
	query?: {
		enabled?: boolean;
	};
	config: SdkConfig;
};

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

export const listPrimarySaleItemsQueryOptions = (
	args: ListPrimarySaleItemsQueryOptions,
) => {
	const { config, primarySaleContractAddress, query } = args;

	return {
		queryKey: ['listPrimarySaleItems', args],
		queryFn: async ({ pageParam }: { pageParam: Page }) => {
			return fetchListPrimarySaleItems(
				{
					chainId: String(args.chainId),
					primarySaleContractAddress: primarySaleContractAddress!,
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
		...query,
		enabled: !!primarySaleContractAddress && query?.enabled !== false,
	};
};

// Types for the count query
export type GetCountQueryOptions = Omit<
	ListPrimarySaleItemsQueryOptions,
	'page'
>;

export const getCountQueryOptions = (args: GetCountQueryOptions) => {
	const { config, primarySaleContractAddress, query, ...rest } = args;

	return {
		queryKey: ['getCountOfPrimarySaleItems', rest],
		queryFn: async () => {
			const marketplaceClient = getMarketplaceClient(config);

			return marketplaceClient.getCountOfPrimarySaleItems({
				chainId: String(rest.chainId),
				primarySaleContractAddress: primarySaleContractAddress || '',
				filter: rest.filter,
			});
		},
		...query,
		enabled: !!primarySaleContractAddress && query?.enabled !== false,
	};
};

export type { ListPrimarySaleItemsArgs, ListPrimarySaleItemsReturn };
