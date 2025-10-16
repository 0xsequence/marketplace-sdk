import { queryOptions, skipToken } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { UseQueryParameters } from 'wagmi/query';
import type { SdkConfig } from '../../../types';
import { collectableKeys, getIndexerClient } from '../../_internal';

export type UseTokenBalancesArgs = {
	collectionAddress: Address;
	userAddress: Address | undefined;
	chainId: number;
	includeMetadata?: boolean;
	query?: UseQueryParameters;
};

/**
 * Fetches the token balances for a user
 *
 * @param args - Arguments for the API call
 * @param config - SDK configuration
 * @returns The balance data
 */
export async function fetchTokenBalances(
	args: Omit<UseTokenBalancesArgs, 'userAddress'> & {
		userAddress: Address;
	},
	config: SdkConfig,
) {
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient
		.getTokenBalances({
			accountAddress: args.userAddress,
			contractAddress: args.collectionAddress,
			includeMetadata: args.includeMetadata ?? false,
			metadataOptions: {
				verifiedOnly: true,
				includeContracts: [args.collectionAddress],
			},
		})
		.then((res) => res.balances || []);
}

export function getTokenBalancesQueryKey(args: UseTokenBalancesArgs) {
	const apiArgs = {
		chainId: args.chainId,
		accountAddress: args.userAddress,
		contractAddress: args.collectionAddress,
		includeMetadata: args.includeMetadata,
		metadataOptions: args.userAddress
			? {
					verifiedOnly: true,
					includeContracts: [args.collectionAddress],
				}
			: undefined,
	};

	return [...collectableKeys.userBalances, apiArgs] as const;
}

/**
 * Creates a tanstack query options object for the token balances query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
export function tokenBalancesOptions(
	args: UseTokenBalancesArgs,
	config: SdkConfig,
) {
	const enabled =
		!!args.userAddress &&
		!!args.collectionAddress &&
		(args.query?.enabled ?? true);

	return queryOptions({
		queryKey: getTokenBalancesQueryKey(args),
		queryFn: enabled
			? () =>
					fetchTokenBalances(
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
