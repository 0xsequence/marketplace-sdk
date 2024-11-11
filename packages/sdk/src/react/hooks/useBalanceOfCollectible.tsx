import {
	AddressSchema,
	ChainIdSchema,
	CollectableIdSchema,
	type QueryArgSchema,
	collectableKeys,
	getIndexerClient,
} from '@internal';
import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '@types';
import type { Hex } from 'viem';
import { z } from 'zod';
import { useConfig } from './useConfig';

const fetchBalanceOfCollectibleSchema = z.object({
	collectionAddress: AddressSchema,
	collectableId: CollectableIdSchema.pipe(z.coerce.string()),
	userAddress: AddressSchema,
	chainId: ChainIdSchema.pipe(z.coerce.number()),
});

type FetchBalanceOfCollectibleArgs = z.input<
	typeof fetchBalanceOfCollectibleSchema
>;

const fetchBalanceOfCollectible = async (
	args: FetchBalanceOfCollectibleArgs,
	config: SdkConfig,
) => {
	const parsedArgs = fetchBalanceOfCollectibleSchema.parse(args);
	const indexerClient = getIndexerClient(parsedArgs.chainId, config);
	return indexerClient
		.getTokenBalances({
			accountAddress: parsedArgs.userAddress,
			contractAddress: parsedArgs.collectionAddress,
			tokenID: parsedArgs.collectableId,
			includeMetadata: false,
			metadataOptions: {
				verifiedOnly: true,
				includeContracts: [parsedArgs.collectionAddress],
			},
		})
		.then((res) => res.balances[0] || null);
};

interface BalanceOfCollectibleOptions
	extends Omit<FetchBalanceOfCollectibleArgs, 'userAddress'> {
	userAddress?: Hex;
	query?: z.infer<typeof QueryArgSchema>;
}
export const balanceOfCollectibleOptions = (
	args: BalanceOfCollectibleOptions,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.userBalances, args, config],
		queryFn: args.userAddress
			? () =>
					fetchBalanceOfCollectible(
						{
							...args,
							// biome-ignore lint/style/noNonNullAssertion: this is guaranteed by the userAddress check above
							userAddress: args.userAddress!,
						},
						config,
					)
			: skipToken,
		enabled: !!args.userAddress || args.query?.enabled,
	});
};

export const useBalanceOfCollectible = (args: BalanceOfCollectibleOptions) => {
	const config = useConfig();
	return useQuery(balanceOfCollectibleOptions(args, config));
};
