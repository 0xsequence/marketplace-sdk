import { useQuery } from '@tanstack/react-query';

import { useConfig } from '..';
import { getIndexerClient } from '../_internal';

export const useGetTokenSuppliesMap = ({
	chainId,
	tokenIds,
	collectionAddress,
}: {
	chainId: number;
	tokenIds: string[];
	collectionAddress: string;
}) => {
	const config = useConfig();
	const indexerClient = getIndexerClient(chainId, config);
	return useQuery({
		queryKey: ['indexer-tokenSupplies', tokenIds, collectionAddress, chainId],
		queryFn: () => {
			return indexerClient.getTokenSuppliesMap({
				tokenMap: {
					[collectionAddress]: tokenIds,
				},
				includeMetadata: false,
			});
		},
	});
};
