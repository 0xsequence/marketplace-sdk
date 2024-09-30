import {
	type ChainId,
	type QueryArg,
	collectableKeys,
	getMetadataClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseCollectableArgs = {
	chainId: ChainId;
	collectionAddress: string;
	tokenId: string;
} & QueryArg;

const fetchCollectable = async (
	args: UseCollectableArgs,
	config: SdkConfig,
) => {
	const metadataClient = getMetadataClient(config);
	return metadataClient
		.getTokenMetadata({
			chainID: String(args.chainId),
			contractAddress: args.collectionAddress,
			tokenIDs: [args.tokenId],
		})
		.then((resp) => resp.tokenMetadata[0]!);
};

export const collectableOptions = (
	args: UseCollectableArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [collectableKeys.details, args, config],
		queryFn: () => fetchCollectable(args, config),
	});
};

export const useCollectable = (args: UseCollectableArgs) => {
	const config = useConfig();
	return useQuery(collectableOptions(args, config));
};
