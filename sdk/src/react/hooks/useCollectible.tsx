import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMetadataClient } from '../_internal';
import { useConfig } from './useConfig';

/**
 * Arguments for fetching collectable metadata
 */
export interface UseCollectibleArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** The specific token ID within the collection. If not provided, returns the first token */
	collectibleId?: string;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Return type for the useCollectible hook containing token metadata
 */
export type UseCollectibleReturn = Awaited<ReturnType<typeof fetchCollectible>>;

const fetchCollectible = async (
	args: UseCollectibleArgs,
	config: SdkConfig,
) => {
	const metadataClient = getMetadataClient(config);
	const tokenIds = args.collectibleId ? [args.collectibleId] : [];

	return metadataClient
		.getTokenMetadata({
			chainID: args.chainId.toString(),
			contractAddress: args.collectionAddress,
			tokenIDs: tokenIds,
		})
		.then((resp) => resp.tokenMetadata[0]);
};

export const collectibleOptions = (
	args: UseCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.details, args, config],
		queryFn: () => fetchCollectible(args, config),
	});
};

/**
 * Hook to fetch metadata for a specific collectable (NFT)
 *
 * Retrieves comprehensive metadata including name, description, image, attributes,
 * and other properties for a specific token within an NFT collection.
 *
 * @param args - Configuration object containing chain ID, collection address, and optional token ID
 * @returns React Query result with collectable metadata, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: collectable, isLoading, error } = useCollectible({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error loading collectable</div>;
 *
 * return (
 *   <div>
 *     <h1>{collectable?.name}</h1>
 *     <img src={collectable?.image} alt={collectable?.name} />
 *   </div>
 * );
 * ```
 */
export const useCollectible = (args: UseCollectibleArgs) => {
	const config = useConfig();
	return useQuery(collectibleOptions(args, config));
};
