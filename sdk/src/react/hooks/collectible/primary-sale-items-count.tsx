import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import type { ListPrimarySaleItemsQueryOptions } from '../../queries/collectible/primary-sale-list';
import { primarySaleItemsCountQueryOptions } from '../../queries/collectible/primary-sale-list-count';
import { useConfig } from '../config/useConfig';

export type UseCountOfPrimarySaleItemsArgs = Optional<
	ListPrimarySaleItemsQueryOptions,
	'config'
>;

/**
 * @deprecated Use useGetCountOfPrimarySaleItems instead
 */
export function useCollectiblePrimarySaleListCount(
	args: UseCountOfPrimarySaleItemsArgs,
) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, ...rest } = args;

	const queryOptions = primarySaleItemsCountQueryOptions({
		config,
		...rest,
	});

	return useQuery(queryOptions);
}
