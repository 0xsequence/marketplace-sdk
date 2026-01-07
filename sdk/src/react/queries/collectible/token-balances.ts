import { ContractVerificationStatus } from '@0xsequence/indexer';
import type { Address } from 'viem';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	getIndexerClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { createCollectibleQueryKey } from './queryKeys';

export interface FetchTokenBalancesParams {
	collectionAddress: Address;
	userAddress: Address;
	chainId: number;
	includeMetadata?: boolean;
}

export type TokenBalancesQueryOptions =
	SdkQueryParams<FetchTokenBalancesParams>;

/**
 * Fetches the token balances for a user
 *
 * @param params - Parameters for the API call
 * @returns The balance data
 */
export async function fetchTokenBalances(
	params: WithRequired<
		TokenBalancesQueryOptions,
		'chainId' | 'collectionAddress' | 'userAddress' | 'config'
	>,
) {
	const { chainId, userAddress, collectionAddress, includeMetadata, config } =
		params;
	const indexerClient = getIndexerClient(chainId, config);
	return indexerClient
		.getTokenBalancesByContract({
			filter: {
				accountAddresses: [userAddress],
				contractAddresses: [collectionAddress],
				contractStatus: ContractVerificationStatus.VERIFIED,
			},
			omitMetadata: !includeMetadata,
		})
		.then((res) => res.balances || []);
}

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
export function tokenBalancesOptions(
	params: WithOptionalParams<
		WithRequired<
			TokenBalancesQueryOptions,
			'chainId' | 'collectionAddress' | 'userAddress' | 'config'
		>
	>,
) {
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
			customValidation: (p) =>
				!!p.collectionAddress &&
				isAddress(p.collectionAddress) &&
				!!p.userAddress &&
				isAddress(p.userAddress),
		},
		params,
	);
}
