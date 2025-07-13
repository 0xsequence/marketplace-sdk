import { useInfiniteQuery } from '@tanstack/react-query';
import { ContractType } from '../../../_internal';
import {
	inventoryOptions,
	type UseInventoryArgs,
} from '../../../queries/inventory';
import { useConfig } from '../../config/useConfig';
import { useMarketplaceConfig } from '../../config/useMarketplaceConfig';

export function useInventory(args: UseInventoryArgs) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const isLaos721 =
		marketplaceConfig?.market?.collections?.find(
			(c) =>
				c.itemsAddress === args.collectionAddress && c.chainId === args.chainId,
		)?.contractType === ContractType.LAOS_ERC_721;

	return useInfiniteQuery(inventoryOptions({ ...args, isLaos721 }, config));
}
