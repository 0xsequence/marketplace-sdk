import type { GetCollectionDetailRequest } from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import { getMarketplaceClient, type ValuesOptional } from '../../_internal';

import type { StandardQueryOptions } from '../../types/query';

export interface FetchMarketCollectionDetailParams
	extends Omit<GetCollectionDetailRequest, 'chainId' | 'contractAddress'> {
	chainId: number;
	collectionAddress: string;
	config: SdkConfig;
}

/**
 * Fetches collection details from the marketplace API
 */
export async function fetchMarketCollectionDetail(
	params: FetchMarketCollectionDetailParams,
) {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: GetCollectionDetailRequest = {
		contractAddress: collectionAddress,
		chainId: chainId,
		...additionalApiParams,
	};

	const result = await marketplaceClient.getCollectionDetail(apiArgs);
	return result.collection;
}

export type MarketCollectionDetailQueryOptions =
	ValuesOptional<FetchMarketCollectionDetailParams> & {
		query?: StandardQueryOptions;
	};

export function getCollectionMarketDetailQueryKey(
	params: MarketCollectionDetailQueryOptions,
) {
	const apiArgs: GetCollectionDetailRequest = {
		chainId: params.chainId ?? 0,
		contractAddress: params.collectionAddress ?? '',
	};

	const client = getMarketplaceClient(params.config!);
	return client.queryKey.getCollectionDetail({
		...apiArgs,
		chainId: apiArgs.chainId.toString(),
	});
}

export function collectionMarketDetailQueryOptions(
	params: MarketCollectionDetailQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCollectionMarketDetailQueryKey(params),
		queryFn: () =>
			fetchMarketCollectionDetail({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
