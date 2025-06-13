import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { type ValuesOptional, getMarketplaceClient } from '../_internal';
import type {
	Collection,
	GetCollectionDetailArgs,
} from '../_internal/api/marketplace.gen';
import { collectionKeys } from '../_internal/api/query-keys';
import type { StandardQueryOptions } from '../types/query';

export interface FetchCollectionDetailsParams
	extends Omit<GetCollectionDetailArgs, 'chainId' | 'contractAddress'> {
	chainId: number;
	collectionAddress: string;
	config: SdkConfig;
}

/**
 * Fetches collection details from the marketplace API
 */
export async function fetchCollectionDetails(
	params: FetchCollectionDetailsParams,
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

export type CollectionDetailsQueryOptions =
	ValuesOptional<FetchCollectionDetailsParams> & {
		query?: StandardQueryOptions;
	};

export function collectionDetailsQueryOptions(
	params: CollectionDetailsQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...collectionKeys.detail, params],
		queryFn: () =>
			fetchCollectionDetails({
				// biome-ignore lint/style/noNonNullAssertion:The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion:The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion:
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
