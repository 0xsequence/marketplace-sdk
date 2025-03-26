import { queryOptions, skipToken } from '@tanstack/react-query';
import type { Hex } from 'viem';
import type { UseQueryParameters } from 'wagmi/query';
import type { SdkConfig } from '../../types';
import { collectableKeys, getIndexerClient } from '../_internal';

export type UseBalanceOfCollectibleArgs = {
	collectionAddress: Hex;
	collectableId: string;
	userAddress: Hex | undefined;
	chainId: number;
	query?: UseQueryParameters;
};

/**
 * Fetches the balance of a specific collectible for a user
 *
 * @param args - Arguments for the API call
 * @param config - SDK configuration
 * @returns The balance data
 */
export async function fetchBalanceOfCollectible(
	args: UseBalanceOfCollectibleArgs,
	config: SdkConfig,
) {
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient
		.getTokenBalances({
			accountAddress: args.userAddress,
			contractAddress: args.collectionAddress,
			tokenID: args.collectableId,
			includeMetadata: false,
			metadataOptions: {
				verifiedOnly: true,
				includeContracts: [args.collectionAddress],
			},
		})
		.then((res) => res.balances[0] || null);
}

/**
 * Creates a tanstack query options object for the balance query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
export function balanceOfCollectibleOptions(
	args: UseBalanceOfCollectibleArgs,
	config: SdkConfig,
) {
	const enabled = !!args.userAddress && (args.query?.enabled ?? true);
	return queryOptions({
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
	});
}
