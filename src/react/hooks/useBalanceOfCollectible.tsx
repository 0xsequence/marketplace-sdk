import {
	type ChainId,
	type QueryArg,
	collectableKeys,
	getIndexerClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { useConfig } from './useConfig';

export type UseBalanceOfCollectibleArgs = {
	collectionAddress: string;
	userAddress: string;
	tokenId: string;
	chainId: ChainId;
} & QueryArg;

const fetchBalanceOfCollectible = async (
	args: UseBalanceOfCollectibleArgs,
	config: SdkConfig,
) => {
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient
		.getTokenBalances({
			accountAddress: args.userAddress,
			contractAddress: args.collectionAddress,
			tokenID: args.tokenId,
			includeMetadata: false,
			metadataOptions: {
				verifiedOnly: true,
				includeContracts: [args.collectionAddress],
			},
		})
		.then((res) => res.balances[0] || null);
};

export const balanceOfCollectibleOptions = (
	args: UseBalanceOfCollectibleArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [collectableKeys.userBalances, args, config],
		queryFn: () => fetchBalanceOfCollectible(args, config),
	});
};

export const useBalanceOfCollectible = (args: UseBalanceOfCollectibleArgs) => {
	const config = useConfig();
	return useQuery(balanceOfCollectibleOptions(args, config));
};
