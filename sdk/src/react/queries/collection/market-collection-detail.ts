import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type { GetCollectionDetailArgs } from '../../_internal/api/marketplace.gen';

import type { StandardQueryOptions } from '../../types/query';

export interface FetchMarketCollectionDetailParams
	extends Omit<GetCollectionDetailArgs, 'chainId' | 'contractAddress'> {
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

	const apiArgs: GetCollectionDetailArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams,
	};

	const result = await marketplaceClient.getCollectionDetail(apiArgs);
	return result.collection;
}

export type MarketCollectionDetailQueryOptions =
	ValuesOptional<FetchMarketCollectionDetailParams> & {
		query?: StandardQueryOptions;
	};

export function getMarketCollectionDetailQueryKey(
	params: MarketCollectionDetailQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
	} satisfies QueryKeyArgs<GetCollectionDetailArgs>;

	return ['collection', 'market-collection-detail', apiArgs] as const;
}

export function marketCollectionDetailQueryOptions(
	params: MarketCollectionDetailQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getMarketCollectionDetailQueryKey(params),
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
