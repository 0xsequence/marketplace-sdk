import {
	type ChainId,
	type QueryArg,
	collectableKeys,
	getMetadataClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseCollectibleArgs = {
	chainId: ChainId;
	collectionAddress: string;
	collectibleId: string;
} & QueryArg;

export type UseCollectibleReturn = ReturnType<typeof fetchCollectible>;

const fetchCollectible = async (
	args: UseCollectibleArgs,
	config: SdkConfig,
) => {
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.getTokenMetadata({
			chainID: String(args.chainId),
			contractAddress: args.collectionAddress,
			tokenIDs: [args.collectibleId],
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

export const useCollectible = (args: UseCollectibleArgs) => {
	const config = useConfig();
	return useQuery(collectibleOptions(args, config));
};
