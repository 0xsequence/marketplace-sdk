import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { Page, SdkConfig } from '../../types';
import type {
	CollectiblePrimarySaleItem,
	ListPrimarySaleItemsArgs,
	ListPrimarySaleItemsReturn,
	PrimarySaleItemsFilter,
} from '../_internal';
import { getMarketplaceClient } from '../_internal';

export type UseListPrimarySaleItemsArgs = {
	primarySaleContractAddress: Hex;
	chainId: number;
	filter?: PrimarySaleItemsFilter;
	query?: {
		enabled?: boolean;
	};
};

/**
 * Fetches a list of primary sale items with pagination support
 *
 * @param args - Arguments for the API call
 * @param config - SDK configuration
 * @param page - Page parameters for pagination
 * @returns The primary sale items data
 */
export async function fetchPrimarySaleItems(
	args: UseListPrimarySaleItemsArgs,
	config: SdkConfig,
	page: Page,
): Promise<ListPrimarySaleItemsReturn> {
	const marketplaceClient = getMarketplaceClient(config);
	const { chainId, primarySaleContractAddress, filter } = args;

	const parsedArgs: ListPrimarySaleItemsArgs = {
		chainId: String(chainId),
		primarySaleContractAddress,
		filter,
		page,
	};

	return await marketplaceClient.listPrimarySaleItems(parsedArgs);
}

/**
 * Creates a tanstack infinite query options object for the primary sale items query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
export function listPrimarySaleItemsOptions(
	args: UseListPrimarySaleItemsArgs,
	config: SdkConfig,
) {
	return infiniteQueryOptions({
		...args.query,
		queryKey: ['primarySaleItems', 'list', args, config],
		queryFn: ({ pageParam }) => fetchPrimarySaleItems(args, config, pageParam),
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
	});
}
