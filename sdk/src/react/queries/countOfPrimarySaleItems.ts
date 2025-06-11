import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import {
	type GetCountOfPrimarySaleItemsArgs,
	type GetCountOfPrimarySaleItemsReturn,
	type PrimarySaleItemsFilter,
	getMarketplaceClient,
} from '../_internal';

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
): Promise<GetCountOfPrimarySaleItemsReturn> {
	const marketplaceClient = getMarketplaceClient(config);

	const { chainId, primarySaleContractAddress, filter } = args;
	const data = await marketplaceClient.getCountOfPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter,
	});

	return data;
}

export function countOfPrimarySaleItemsOptions(
	args: UseCountOfPrimarySaleItemsArgs,
	config: SdkConfig,
) {
	return queryOptions({
		enabled: args.query?.enabled ?? true,
		queryKey: ['countOfPrimarySaleItems', args],
		queryFn: () => fetchCountOfPrimarySaleItems(args, config),
	});
}
