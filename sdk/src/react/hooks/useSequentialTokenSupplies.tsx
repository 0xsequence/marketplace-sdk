import type { TokenSupply } from '@0xsequence/indexer';
import { useQueries } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useConfig } from '..';
import { getIndexerClient } from '../_internal';

interface UseSequentialTokenSuppliesProps {
	chainId: number;
	tokenIds: string[];
	collectionAddress: Address;
	query?: {
		enabled?: boolean;
	};
}

export function useSequentialTokenSupplies({
	chainId,
	tokenIds,
	collectionAddress,
	query = {},
}: UseSequentialTokenSuppliesProps) {
	const config = useConfig();
	const indexerClient = getIndexerClient(chainId, config);

	const results = useQueries({
		queries: tokenIds.map((tokenId) => ({
			queryKey: ['token-supplies', chainId, collectionAddress, tokenId],
			queryFn: async () => {
				try {
					const result = await indexerClient.getTokenSuppliesMap({
						tokenMap: {
							[collectionAddress]: [tokenId],
						},
						includeMetadata: false,
					});
					return {
						tokenId,
						supplies: result.supplies?.[collectionAddress] ?? [],
						error: null,
					};
				} catch (error) {
					return {
						tokenId,
						supplies: [],
						error,
					};
				}
			},
			enabled: query.enabled,
		})),
	});

	const isLoading = results.some((result) => result.isLoading);
	const errors = results
		.map((result) => result.data?.error)
		.filter((error): error is Error => error !== null);

	// Combine all supplies into a single object matching the original hook's format
	const data = results.reduce(
		(acc, result) => {
			if (result.data?.supplies) {
				if (!acc.supplies[collectionAddress]) {
					acc.supplies[collectionAddress] = [];
				}
				acc.supplies[collectionAddress].push(...result.data.supplies);
			}
			return acc;
		},
		{ supplies: {} as Record<string, TokenSupply[]> },
	);

	return {
		data,
		isLoading,
		errors: errors.length > 0 ? errors : null,
	};
}
