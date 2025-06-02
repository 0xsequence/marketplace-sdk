import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { getMarketplaceClient } from '../_internal';
import { useConfig } from './useConfig';

type UseCollectionDetails = {
	collectionAddress: string;
	chainId: number;
};

const fetchCollectionDetails = async ({
	collectionAddress,
	chainId,
	config,
}: {
	collectionAddress: string;
	chainId: number;
	config: SdkConfig;
}) => {
	const marketplaceClient = getMarketplaceClient(config);
	const { collection } = await marketplaceClient.getCollectionDetail({
		chainId: String(chainId),
		contractAddress: collectionAddress,
	});
	return collection;
};

export const collectionDetailsOptions = (
	args: UseCollectionDetails,
	config: SdkConfig,
) => {
	return queryOptions({
		queryKey: ['collectionDetails', args],
		queryFn: () =>
			fetchCollectionDetails({
				collectionAddress: args.collectionAddress,
				chainId: args.chainId,
				config,
			}),
	});
};

export const useCollectionDetails = (args: UseCollectionDetails) => {
	const config = useConfig();
	return useQuery(collectionDetailsOptions(args, config));
};
