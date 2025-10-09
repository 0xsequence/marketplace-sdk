import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	collectableKeys,
	type GetCollectibleLowestListingArgs,
	type GetCollectibleLowestListingReturn,
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchLowestListingParams
	extends Omit<GetCollectibleLowestListingArgs, 'contractAddress' | 'chainId'> {
	collectionAddress: string;
	chainId: number;
	config: SdkConfig;
}

/**
 * Fetches the lowest listing for a collectible from the marketplace API
 */
export async function fetchLowestListing(
	params: FetchLowestListingParams,
): Promise<GetCollectibleLowestListingReturn['order'] | null> {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: GetCollectibleLowestListingArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams,
	};

	const result = await marketplaceClient.getCollectibleLowestListing(apiArgs);
	return result.order || null;
}

export type LowestListingQueryOptions =
	ValuesOptional<FetchLowestListingParams> & {
		query?: StandardQueryOptions;
	};

export function getLowestListingQueryKey(params: LowestListingQueryOptions) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.tokenId,
		filter: params.filter,
	} satisfies QueryKeyArgs<GetCollectibleLowestListingArgs>;

	return [...collectableKeys.lowestListings, apiArgs] as const;
}

export function lowestListingQueryOptions(params: LowestListingQueryOptions) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.tokenId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getLowestListingQueryKey(params),
		queryFn: () =>
			fetchLowestListing({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				tokenId: params.tokenId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
