import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
	getIndexerClient,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import { z } from 'zod';
import { useConfig } from './useConfig';

const UseBalanceOfCollectibleSchema = z.object({
	collectionAddress: AddressSchema,
	userAddress: AddressSchema,
	tokenId: z.string(),
	chainId: ChainIdSchema.pipe(z.coerce.number()),
	query: QueryArgSchema,
});

export type UseBalanceOfCollectibleArgs = z.infer<
	typeof UseBalanceOfCollectibleSchema
>;

const fetchBalanceOfCollectible = async (
	args: UseBalanceOfCollectibleArgs,
	config: SdkConfig,
) => {
	const parsedArgs = UseBalanceOfCollectibleSchema.parse(args);
	const indexerClient = getIndexerClient(parsedArgs.chainId, config);
	return indexerClient
		.getTokenBalances({
			accountAddress: parsedArgs.userAddress,
			contractAddress: parsedArgs.collectionAddress,
			tokenID: parsedArgs.tokenId,
			includeMetadata: false,
			metadataOptions: {
				verifiedOnly: true,
				includeContracts: [parsedArgs.collectionAddress],
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
		queryKey: [...collectableKeys.userBalances, args, config],
		queryFn: () => fetchBalanceOfCollectible(args, config),
	});
};

export const useBalanceOfCollectible = (args: UseBalanceOfCollectibleArgs) => {
	const config = useConfig();
	return useQuery(balanceOfCollectibleOptions(args, config));
};
