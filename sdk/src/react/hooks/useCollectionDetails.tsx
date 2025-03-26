import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { getMarketplaceClient } from '../_internal';
import { useConfig } from './useConfig';

type UseCollectionDetails = {
	collectionAddress: string;
	chainId: number;
};

const fetchCollectionDetails = async (
	args: { collectionAddress: string },
	marketplaceClient: Awaited<ReturnType<typeof getMarketplaceClient>>,
) => {
	const { collection } = await marketplaceClient.getCollectionDetail({
		contractAddress: args.collectionAddress,
	});
	return collection;
};

export const collectionDetailsOptions = (
	args: UseCollectionDetails,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);
	return queryOptions({
		queryKey: ['collectionDetails', args],
		queryFn: () => fetchCollectionDetails(args, marketplaceClient),
	});
};

export const useCollectionDetails = (args: UseCollectionDetails) => {
	const config = useConfig();
	return useQuery(collectionDetailsOptions(args, config));
};
