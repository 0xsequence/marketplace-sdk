import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	type ListPrimarySaleItemsArgs,
	type Page,
	type PrimarySaleItemsFilter,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';

interface UseListPrimarySaleItemsArgs {
	chainId: number;
	primarySaleContractAddress: string;
	filter?: PrimarySaleItemsFilter;
	page?: Page;
}

export type UseListPrimarySaleItemsReturn = Awaited<
	ReturnType<typeof fetchListPrimarySaleItems>
>;

const fetchListPrimarySaleItems = async (
	config: SdkConfig,
	args: UseListPrimarySaleItemsArgs,
) => {
	const arg = {
		chainId: String(args.chainId),
		primarySaleContractAddress: args.primarySaleContractAddress,
		filter: args.filter,
		page: args.page,
	} satisfies ListPrimarySaleItemsArgs;

	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listPrimarySaleItems(arg);
};

export const listPrimarySaleItemsOptions = (
	args: UseListPrimarySaleItemsArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: ['primarySaleItems', args, config],
		queryFn: () => fetchListPrimarySaleItems(config, args),
	});
};

export const useListPrimarySaleItems = (args: UseListPrimarySaleItemsArgs) => {
	const config = useConfig();

	return useQuery(listPrimarySaleItemsOptions(args, config));
};
