import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	collectionKeys,
	type GetCollectionActiveOffersCurrenciesArgs,
	type GetCollectionActiveOffersCurrenciesReturn,
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchCollectionActiveOffersCurrenciesParams
	extends Omit<
		GetCollectionActiveOffersCurrenciesArgs,
		'contractAddress' | 'chainId'
	> {
	collectionAddress: string;
	chainId: number;
	config: SdkConfig;
}

/**
 * Fetches the active offers currencies for a collection from the marketplace API
 */
export async function fetchCollectionActiveOffersCurrencies(
	params: FetchCollectionActiveOffersCurrenciesParams,
): Promise<GetCollectionActiveOffersCurrenciesReturn['currencies']> {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: GetCollectionActiveOffersCurrenciesArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams,
	};

	const result =
		await marketplaceClient.getCollectionActiveOffersCurrencies(apiArgs);
	return result.currencies;
}

export type CollectionActiveOffersCurrenciesQueryOptions =
	ValuesOptional<FetchCollectionActiveOffersCurrenciesParams> & {
		query?: StandardQueryOptions;
	};

export function getCollectionActiveOffersCurrenciesQueryKey(
	params: CollectionActiveOffersCurrenciesQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
	} satisfies QueryKeyArgs<GetCollectionActiveOffersCurrenciesArgs>;

	return [...collectionKeys.activeOffersCurrencies, apiArgs] as const;
}

export function collectionActiveOffersCurrenciesQueryOptions(
	params: CollectionActiveOffersCurrenciesQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCollectionActiveOffersCurrenciesQueryKey(params),
		queryFn: () =>
			fetchCollectionActiveOffersCurrencies({
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
