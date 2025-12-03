import { useQuery } from '@tanstack/react-query';
import {
	countOfPrimarySaleItemsOptions,
	type UseCountOfPrimarySaleItemsArgs,
} from '../../../queries';
import { useConfig } from '../../config/useConfig';

export function useCountOfPrimarySaleItems(
	args: UseCountOfPrimarySaleItemsArgs,
) {
	const config = useConfig();
	return useQuery(countOfPrimarySaleItemsOptions(args, config));
}
