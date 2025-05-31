import { useInfiniteQuery } from '@tanstack/react-query';
import { type UseInventoryArgs, inventoryOptions } from '../queries/inventory';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';

export function useInventory(args: UseInventoryArgs) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	// Check if the collection is a LAOS ERC721
	const isLaos721 =
		(marketplaceConfig?.market?.collections?.find(
			(c) =>
				c.itemsAddress === args.collectionAddress && c.chainId === args.chainId,
		)?.contractType as string) === 'LAOSERC721';

	const argsWithLaos = isLaos721 ? { ...args, isLaos721: true } : args;

	return useInfiniteQuery(inventoryOptions(argsWithLaos, config));
}
