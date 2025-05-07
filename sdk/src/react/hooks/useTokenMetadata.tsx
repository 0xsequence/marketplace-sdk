import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { collectionKeys, getMetadataClient } from '../_internal';
import { useConfig } from './useConfig';

interface FetchTokenMetadataArgs {
	chainId: number;
	contractAddress: string;
	tokenIds: number[];
	query?: {
		enabled?: boolean;
	};
}

const fetchTokenMetadata = async (
	{ chainId, contractAddress, tokenIds }: FetchTokenMetadataArgs,
	config: SdkConfig,
) => {
	const metadataClient = getMetadataClient(config);

	const response = await metadataClient.getTokenMetadata({
		chainID: chainId.toString(),
		contractAddress: contractAddress,
		tokenIDs: tokenIds.map((id) => id.toString()),
	});

	return response.tokenMetadata;
};

export const tokenMetadataOptions = (
	args: FetchTokenMetadataArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectionKeys.detail, args.chainId, args.contractAddress],
		queryFn: () => fetchTokenMetadata(args, config),
	});
};

export const useTokenMetadata = (args: FetchTokenMetadataArgs) => {
	const config = useConfig();
	const { chainId, contractAddress, tokenIds, query } = args;

	return useQuery({
		...tokenMetadataOptions(
			{ chainId, contractAddress, tokenIds, query },
			config,
		),
	});
};
