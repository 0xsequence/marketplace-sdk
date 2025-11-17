import { queryOptions, skipToken } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { UseQueryParameters } from 'wagmi/query';
import type { SdkConfig } from '../../../types';
import { getIndexerClient } from '../../_internal';
import { createCollectibleQueryKey } from './queryKeys';

export type UseBalanceOfCollectibleArgs = {
	collectionAddress: Address;
	collectibleId: bigint;
	userAddress: Address | undefined;
	chainId: number;
	includeMetadata?: boolean;
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
	args: Omit<UseBalanceOfCollectibleArgs, 'userAddress'> & {
		userAddress: Address;
	},
	config: SdkConfig,
) {
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient
		.getTokenBalances({
			accountAddress: args.userAddress,
			contractAddress: args.collectionAddress,
			tokenId: args.collectibleId,
			includeMetadata: args.includeMetadata ?? false,
			metadataOptions: {
				verifiedOnly: true,
			},
		})
		.then((res) => res.balances[0] || null);
}

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'balance', { chainId, accountAddress, contractAddress, tokenID }]
 */
export function getBalanceOfCollectibleQueryKey(
	args: UseBalanceOfCollectibleArgs,
) {
	const apiArgs = {
		chainId: args.chainId,
		accountAddress: args.userAddress,
		contractAddress: args.collectionAddress,
		tokenId: args.collectableId,
		includeMetadata: args.includeMetadata,
		metadataOptions: args.userAddress
			? {
					verifiedOnly: true,
				}
			: undefined,
	};

	return createCollectibleQueryKey('balance', apiArgs);
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
		queryKey: getBalanceOfCollectibleQueryKey(args),
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
