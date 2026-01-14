import type { GetBalanceOfCollectibleRequest } from '@0xsequence/api-client';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	getIndexerClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createCollectibleQueryKey } from './queryKeys';

export type FetchBalanceOfCollectibleParams = GetBalanceOfCollectibleRequest;

export type BalanceOfCollectibleQueryOptions =
	SdkQueryParams<FetchBalanceOfCollectibleParams>;

/**
 * Fetches the balance of a specific collectible for a user
 *
 * @param params - Parameters for the API call
 * @returns The balance data
 */
export async function fetchBalanceOfCollectible(
	params: WithRequired<
		BalanceOfCollectibleQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'userAddress' | 'config'
	>,
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
	const shouldIncludeMetadata = includeMetadata ?? false;
	return indexerClient
		.getTokenBalances({
			accountAddress: userAddress,
			contractAddress: collectionAddress,
			tokenId,
			includeMetadata: shouldIncludeMetadata,
			...(shouldIncludeMetadata && {
				metadataOptions: {
					verifiedOnly: true,
				},
			}),
		})
		.then((res) => res.balances[0] || null);
}

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'balance', { chainId, accountAddress, contractAddress, tokenID }]
 */
export function getBalanceOfCollectibleQueryKey(
	params: BalanceOfCollectibleQueryOptions,
) {
	const shouldIncludeMetadata = params.includeMetadata ?? false;
	const apiArgs = {
		chainId: params.chainId,
		accountAddress: params.userAddress,
		contractAddress: params.collectionAddress,
		tokenId: params.tokenId,
		includeMetadata: shouldIncludeMetadata,
		...(shouldIncludeMetadata && {
			metadataOptions: {
				verifiedOnly: true,
			},
		}),
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
	params: WithOptionalParams<
		WithRequired<
			BalanceOfCollectibleQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'userAddress' | 'config'
		>
	>,
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
			customValidation: (p) =>
				!!p.collectionAddress &&
				isAddress(p.collectionAddress) &&
				p.tokenId !== undefined &&
				p.tokenId >= 0n &&
				!!p.userAddress &&
				isAddress(p.userAddress),
		},
		params,
	);
}
