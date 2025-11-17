import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getIndexerClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';
import { createCollectibleQueryKey } from './queryKeys';

export interface FetchBalanceOfCollectibleParams {
	collectionAddress: Address;
	tokenId: bigint;
	userAddress: Address;
	chainId: number;
	includeMetadata?: boolean;
	config: SdkConfig;
	query?: StandardQueryOptions;
}

/**
 * Fetches the balance of a specific collectible for a user
 *
 * @param params - Parameters for the API call
 * @returns The balance data
 */
export async function fetchBalanceOfCollectible(
	params: FetchBalanceOfCollectibleParams,
) {
	const {
		chainId,
		userAddress,
		collectionAddress,
		tokenId,
		includeMetadata,
		config,
	} = params;
	const indexerClient = getIndexerClient(chainId, config);
	return indexerClient
		.getTokenBalances({
			accountAddress: userAddress,
			contractAddress: collectionAddress,
			tokenId,
			includeMetadata: includeMetadata ?? false,
			metadataOptions: {
				verifiedOnly: true,
			},
		})
		.then((res) => res.balances[0] || null);
}

export type BalanceOfCollectibleQueryOptions =
	WithOptionalParams<FetchBalanceOfCollectibleParams>;

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'balance', { chainId, accountAddress, contractAddress, tokenID }]
 */
export function getBalanceOfCollectibleQueryKey(
	params: BalanceOfCollectibleQueryOptions,
) {
	const apiArgs = {
		chainId: params.chainId,
		accountAddress: params.userAddress,
		contractAddress: params.collectionAddress,
		tokenId: params.tokenId,
		includeMetadata: params.includeMetadata,
		metadataOptions: params.userAddress
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
 * @param params - The query parameters
 * @returns Query options configuration
 */
export function balanceOfCollectibleOptions(
	params: BalanceOfCollectibleQueryOptions,
) {
	return buildQueryOptions(
		{
			getQueryKey: getBalanceOfCollectibleQueryKey,
			requiredParams: [
				'userAddress',
				'collectionAddress',
				'tokenId',
				'chainId',
				'config',
			] as const,
			fetcher: fetchBalanceOfCollectible,
		},
		params,
	);
}
