import { useInfiniteQuery } from '@tanstack/react-query';
import { type UseInventoryArgs, inventoryOptions } from '../queries/inventory';
import { useConfig } from './useConfig';

export function useInventory(args: UseInventoryArgs) {
	const config = useConfig();
	return useInfiniteQuery(inventoryOptions(args, config));
}
