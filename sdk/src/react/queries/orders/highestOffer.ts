import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	collectableKeys,
	type GetCollectibleHighestOfferArgs,
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchHighestOfferParams
	extends Omit<GetCollectibleHighestOfferArgs, 'contractAddress' | 'chainId'> {
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

	const apiArgs: GetCollectibleHighestOfferArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams,
	};

	const result = await marketplaceClient.getCollectibleHighestOffer(apiArgs);
	return result.order ?? null;
}

export type HighestOfferQueryOptions =
	ValuesOptional<FetchHighestOfferParams> & {
		query?: StandardQueryOptions;
	};

export function getHighestOfferQueryKey(params: HighestOfferQueryOptions) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.tokenId,
		filter: params.filter,
	} satisfies QueryKeyArgs<GetCollectibleHighestOfferArgs>;

	return [...collectableKeys.highestOffers, apiArgs] as const;
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
