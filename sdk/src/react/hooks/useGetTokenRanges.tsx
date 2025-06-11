import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useConfig } from '..';
import { getIndexerClient } from '../_internal';

interface UseGetTokenRangesProps {
	chainId: number;
	collectionAddress: Address;
	query?: {
		enabled?: boolean;
	};
}

export function useGetTokenRanges({
	chainId,
	collectionAddress,
	query = {},
}: UseGetTokenRangesProps) {
	const config = useConfig();
	const indexerClient = getIndexerClient(chainId, config);

	return useQuery({
		queryKey: ['indexer-tokenRanges', chainId, collectionAddress],
		queryFn: () => {
			return indexerClient.getTokenIDRanges({
				contractAddress: collectionAddress,
			});
		},
		enabled: query?.enabled,
	});
}
