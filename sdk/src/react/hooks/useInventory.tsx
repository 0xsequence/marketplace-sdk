import { useInfiniteQuery } from '@tanstack/react-query';
import { type UseInventoryArgs, inventoryOptions } from '../queries/inventory';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';

export function useInventory(args: UseInventoryArgs) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	// Check if the collection is a LAOS ERC721
	const isLaos721 =
		marketplaceConfig?.contracts?.find(
			(c) => c.address === args.collectionAddress && c.chainId === args.chainId,
		)?.contractType === 'LAOSERC721';

	if (isLaos721) {
		args.isLaos721 = true;
	}

	return useInfiniteQuery(inventoryOptions(args, config));
}
