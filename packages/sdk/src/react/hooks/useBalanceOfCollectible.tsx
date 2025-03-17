import type { ChainId } from '@0xsequence/network';
import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import {
	AddressSchema,
	ChainIdSchema,
	CollectableIdSchema,
	type QueryArgSchema,
	collectableKeys,
	getIndexerClient,
} from '../_internal';
import { useConfig } from './useConfig';

const fetchBalanceOfCollectibleSchema: z.ZodObject<
	{
		collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
		collectableId: z.ZodPipeline<
			z.ZodUnion<[z.ZodString, z.ZodNumber]>,
			z.ZodString
		>;
		userAddress: z.ZodEffects<z.ZodString, Address, string>;
		chainId: z.ZodPipeline<
			z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
			z.ZodNumber
		>;
	},
	'strip'
> = z.object({
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
	userAddress: Hex | undefined;
	query?: z.infer<typeof QueryArgSchema>;
}
export const balanceOfCollectibleOptions = (
	args: BalanceOfCollectibleOptions,
	config: SdkConfig,
): any => {
	const enabled = !!args.userAddress && (args.query?.enabled ?? true);
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.userBalances, args],
		queryFn: enabled
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
		enabled,
	});
};

export const useBalanceOfCollectible = (
	args: BalanceOfCollectibleOptions,
): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	return useQuery(balanceOfCollectibleOptions(args, config));
};
