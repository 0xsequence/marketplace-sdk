import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import { collectionKeys, getMetadataClient } from '../_internal';
import { useConfig } from './useConfig';

/**
 * Arguments for fetching collection information
 */
export interface UseCollectionArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Return type for the useCollection hook containing collection metadata
 */
export type UseCollectionReturn = Awaited<ReturnType<typeof fetchCollection>>;

const fetchCollection = async (args: UseCollectionArgs, config: SdkConfig) => {
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.getContractInfo({
			chainID: args.chainId.toString(),
			contractAddress: args.collectionAddress,
		})
		.then((resp) => resp.contractInfo);
};

export const collectionOptions = (
	args: UseCollectionArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectionKeys.detail, args, config],
		queryFn: () => fetchCollection(args, config),
	});
};

/**
 * Hook to fetch metadata and information about an NFT collection
 *
 * Retrieves comprehensive collection information including contract details,
 * metadata, and configuration for a specific NFT collection.
 *
 * @param args - Configuration object containing chain ID and collection address
 * @returns React Query result with collection data, loading state, and error handling
 *
 * @example
 * ```tsx
 * const { data: collection, isLoading, error } = useCollection({
 *   chainId: 137,
 *   collectionAddress: '0x...'
 * });
 *
 * if (isLoading) return <div>Loading collection...</div>;
 * if (error) return <div>Error loading collection</div>;
 *
 * return (
 *   <div>
 *     <h1>{collection?.name}</h1>
 *     <p>{collection?.description}</p>
 *   </div>
 * );
 * ```
 */
export const useCollection = (args: UseCollectionArgs) => {
	const config = useConfig();
	return useQuery(collectionOptions(args, config));
};
