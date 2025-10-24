import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import type { ListPrimarySaleItemsQueryOptions } from '../../queries/collectible/primary-sale-items';
import { primarySaleItemsCountQueryOptions } from '../../queries/collectible/primary-sale-items-count';
import { useConfig } from '../config/useConfig';

export type UsePrimarySaleItemsCountParams = Optional<
	ListPrimarySaleItemsQueryOptions,
	'config'
>;

export function usePrimarySaleItemsCount(args: UsePrimarySaleItemsCountParams) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = args;

	const queryOptions = primarySaleItemsCountQueryOptions({
		config,
		...rest,
	});

	return useQuery(queryOptions);
}
