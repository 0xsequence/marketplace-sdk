import { useQuery } from '@tanstack/react-query';
import {
	type UseCountOfPrimarySaleItemsArgs,
	countOfPrimarySaleItemsOptions,
} from '../queries';
import { useConfig } from './useConfig';

export function useCountOfPrimarySaleItems(
	args: UseCountOfPrimarySaleItemsArgs,
) {
	const config = useConfig();
	return useQuery(countOfPrimarySaleItemsOptions(args, config));
}
