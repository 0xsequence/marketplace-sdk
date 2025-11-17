import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getIndexerClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';
import { createCollectibleQueryKey } from './queryKeys';

export interface FetchTokenBalancesParams {
	collectionAddress: Address;
	userAddress: Address;
	chainId: number;
	includeMetadata?: boolean;
	config: SdkConfig;
	query?: StandardQueryOptions;
}

/**
 * Fetches the token balances for a user
 *
 * @param params - Parameters for the API call
 * @returns The balance data
 */
export async function fetchTokenBalances(params: FetchTokenBalancesParams) {
	const { chainId, userAddress, collectionAddress, includeMetadata, config } =
		params;
	const indexerClient = getIndexerClient(chainId, config);
	return indexerClient
		.getTokenBalances({
			accountAddress: userAddress,
			contractAddress: collectionAddress,
			includeMetadata: includeMetadata ?? false,
			metadataOptions: {
				verifiedOnly: true,
			},
		})
		.then((res) => res.balances || []);
}

export type TokenBalancesQueryOptions =
	WithOptionalParams<FetchTokenBalancesParams>;

export function getTokenBalancesQueryKey(params: TokenBalancesQueryOptions) {
	const apiArgs = {
		chainId: params.chainId,
		accountAddress: params.userAddress,
		contractAddress: params.collectionAddress,
		includeMetadata: params.includeMetadata,
		metadataOptions: params.userAddress
			? {
					verifiedOnly: true,
				}
			: undefined,
	};

	return createCollectibleQueryKey('token-balances', apiArgs);
}

/**
 * Creates a tanstack query options object for the token balances query
 *
 * @param params - The query parameters
 * @returns Query options configuration
 */
export function tokenBalancesOptions(params: TokenBalancesQueryOptions) {
	return buildQueryOptions(
		{
			getQueryKey: getTokenBalancesQueryKey,
			requiredParams: [
				'userAddress',
				'collectionAddress',
				'chainId',
				'config',
			] as const,
			fetcher: fetchTokenBalances,
		},
		params,
	);
}
