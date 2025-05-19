import { useInfiniteQuery } from '@tanstack/react-query';
import { type UseInventoryArgs, inventoryOptions } from '../queries/inventory';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';

export function useInventory(args: UseInventoryArgs) {
	const config = useConfig();
	const marketplaceConfig = useMarketplaceConfig();
	const isLaos721 =
		marketplaceConfig.data?.market.collections.find(
			(c) => c.itemsAddress === args.collectionAddress,
		)?.isLAOSERC721 ?? false;

	return useInfiniteQuery(inventoryOptions({ ...args, isLaos721 }, config));
}
