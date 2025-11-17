import type { MarketplaceAPI } from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	type GetLowestPriceListingForCollectibleRequest,
	getMarketplaceClient,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchLowestListingParams
	extends GetHighestPriceOfferForCollectibleRequest {
	config: SdkConfig;
}

/**
 * Fetches the lowest listing for a collectible from the marketplace API
 */
export async function fetchLowestListing(
	params: FetchLowestListingParams,
): Promise<MarketplaceAPI.GetCollectibleLowestListingResponse['order'] | null> {
	const { chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const result = await marketplaceClient.getLowestPriceListingForCollectible({
		chainId,
		...additionalApiParams,
	});
	return result.order || null;
}

export type LowestListingQueryOptions =
	ValuesOptional<FetchLowestListingParams> & {
		query?: StandardQueryOptions;
	};

export function getLowestListingQueryKey(params: LowestListingQueryOptions) {
	return [
		'collectible',
		'market-lowest-listing',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			tokenId: params.tokenId ?? 0n,
			filter: params.filter,
		},
	] as const;
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
