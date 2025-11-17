import { useQuery } from '@tanstack/react-query';
import {
	inventoryOptions,
	type UseInventoryArgs,
} from '../../queries/inventory/inventory';
import { useConfig } from '../config/useConfig';

export function useInventory(args: UseInventoryArgs) {
	const config = useConfig();

	return useQuery(inventoryOptions({ ...args, config }));
}

export type {
	CollectiblesResponse,
	CollectibleWithBalance,
} from '../../queries/inventory/inventory';
