import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	type GetHighestPriceOfferForCollectibleRequest,
	getMarketplaceClient,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchHighestOfferParams
	extends Omit<
		GetHighestPriceOfferForCollectibleRequest,
		'contractAddress' | 'chainId'
	> {
	collectionAddress: string;
	chainId: number;
	config: SdkConfig;
}

/**
 * Fetches the highest offer for a collectible from the marketplace API
 */
export async function fetchHighestOffer(params: FetchHighestOfferParams) {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const result = await marketplaceClient.getHighestPriceOfferForCollectible({
		contractAddress: collectionAddress,
		chainId: chainId,
		...additionalApiParams,
	});
	return result.order ?? null;
}

export type HighestOfferQueryOptions =
	ValuesOptional<FetchHighestOfferParams> & {
		query?: StandardQueryOptions;
	};

export function getHighestOfferQueryKey(params: HighestOfferQueryOptions) {
	// Convert to raw API args (strings) for query key
	const apiArgs = {
		chainId: (params.chainId ?? 0).toString(),
		contractAddress: params.collectionAddress ?? '',
		tokenId: params.tokenId ?? 0n,
		filter: params.filter,
	};

	const client = getMarketplaceClient(params.config!);
	return client.queryKey.getHighestPriceOfferForCollectible(apiArgs);
}

export function highestOfferQueryOptions(params: HighestOfferQueryOptions) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.tokenId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getHighestOfferQueryKey(params),
		queryFn: () =>
			fetchHighestOffer({
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
