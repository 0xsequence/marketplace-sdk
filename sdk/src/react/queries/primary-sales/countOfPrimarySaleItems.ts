import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	collectableKeys,
	type GetCountOfPrimarySaleItemsArgs,
	getMarketplaceClient,
	type PrimarySaleItemsFilter,
	type QueryKeyArgs,
} from '../../_internal';

export interface UseCountOfPrimarySaleItemsArgs
	extends Omit<
		GetCountOfPrimarySaleItemsArgs,
		'chainId' | 'primarySaleContractAddress'
	> {
	chainId: number;
	primarySaleContractAddress: Address;
	filter?: PrimarySaleItemsFilter;
	query?: {
		enabled?: boolean;
	};
}

export async function fetchCountOfPrimarySaleItems(
	args: UseCountOfPrimarySaleItemsArgs,
	config: SdkConfig,
) {
	const marketplaceClient = getMarketplaceClient(config);

	const { chainId, primarySaleContractAddress, filter } = args;
	const data = await marketplaceClient.getCountOfPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter,
	});

	return data.count;
}

export function getCountOfPrimarySaleItemsQueryKey(
	args: UseCountOfPrimarySaleItemsArgs,
) {
	const apiArgs = {
		chainId: String(args.chainId),
		primarySaleContractAddress: args.primarySaleContractAddress,
		filter: args.filter,
	} satisfies QueryKeyArgs<GetCountOfPrimarySaleItemsArgs>;

	return [...collectableKeys.primarySaleItemsCount, apiArgs] as const;
}

export function countOfPrimarySaleItemsOptions(
	args: UseCountOfPrimarySaleItemsArgs,
	config: SdkConfig,
) {
	return queryOptions({
		enabled: args.query?.enabled ?? true,
		queryKey: getCountOfPrimarySaleItemsQueryKey(args),
		queryFn: () => fetchCountOfPrimarySaleItems(args, config),
	});
}
