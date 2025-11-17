import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	type GetHighestPriceOfferForCollectibleRequest,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchHighestOfferParams
	extends GetHighestPriceOfferForCollectibleRequest {
	config: SdkConfig;
	query?: StandardQueryOptions;
}

/**
 * Fetches the highest offer for a collectible from the marketplace API
 */
export async function fetchHighestOffer(params: FetchHighestOfferParams) {
	const { chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const result = await marketplaceClient.getHighestPriceOfferForCollectible({
		chainId,
		...additionalApiParams,
	});
	return result.order ?? null;
}

export type HighestOfferQueryOptions =
	WithOptionalParams<FetchHighestOfferParams>;

export function getHighestOfferQueryKey(params: HighestOfferQueryOptions) {
	return [
		'collectible',
		'market-highest-offer',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			tokenId: params.tokenId ?? 0n,
			filter: params.filter,
		},
	] as const;
}

export function highestOfferQueryOptions(params: HighestOfferQueryOptions) {
	return buildQueryOptions(
		{
			getQueryKey: getHighestOfferQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'tokenId',
				'config',
			] as const,
			fetcher: fetchHighestOffer,
		},
		params,
	);
}
