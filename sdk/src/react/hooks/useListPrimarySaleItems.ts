import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	type ListPrimarySaleItemsArgs,
	type ListPrimarySaleItemsReturn,
	type Page,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';

type UseListPrimarySaleItemsArgs = Omit<ListPrimarySaleItemsArgs, 'chainId'> & {
	query?: { enabled?: boolean };
};

const fetchListPrimarySaleItems = async (
	config: SdkConfig,
	args: ListPrimarySaleItemsArgs,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listPrimarySaleItems(args);
};

export const listPrimarySaleItemsOptions = (
	args: UseListPrimarySaleItemsArgs & { chainId: number },
	config: SdkConfig,
) => {
	return infiniteQueryOptions({
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
	});
};

export const useListPrimarySaleItems = (args: UseListPrimarySaleItemsArgs) => {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const chainId = marketplaceConfig?.shop.collections.find(
		(collection) => collection.saleAddress === args.primarySaleContractAddress,
	)?.chainId;

	return useInfiniteQuery(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		listPrimarySaleItemsOptions({ ...args, chainId: chainId! }, config),
	);
};
