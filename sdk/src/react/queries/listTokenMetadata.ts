import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { getMetadataClient } from '../_internal';

export interface FetchTokenMetadataArgs {
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
		queryKey: ['listTokenMetadata', args.chainId, args.contractAddress],
		queryFn: () => fetchTokenMetadata(args, config),
	});
};
