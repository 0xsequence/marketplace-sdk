import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	collectionKeys,
	type GetCollectionActiveListingsCurrenciesArgs,
	type GetCollectionActiveListingsCurrenciesReturn,
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchCollectionActiveListingsCurrenciesParams
	extends Omit<
		GetCollectionActiveListingsCurrenciesArgs,
		'contractAddress' | 'chainId'
	> {
	collectionAddress: string;
	chainId: number;
	config: SdkConfig;
}

/**
 * Fetches the active listings currencies for a collection from the marketplace API
 */
export async function fetchCollectionActiveListingsCurrencies(
	params: FetchCollectionActiveListingsCurrenciesParams,
): Promise<GetCollectionActiveListingsCurrenciesReturn['currencies']> {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: GetCollectionActiveListingsCurrenciesArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams,
	};

	const result =
		await marketplaceClient.getCollectionActiveListingsCurrencies(apiArgs);
	return result.currencies;
}

export type CollectionActiveListingsCurrenciesQueryOptions =
	ValuesOptional<FetchCollectionActiveListingsCurrenciesParams> & {
		query?: StandardQueryOptions;
	};

export function getCollectionActiveListingsCurrenciesQueryKey(
	params: CollectionActiveListingsCurrenciesQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
	} satisfies QueryKeyArgs<GetCollectionActiveListingsCurrenciesArgs>;

	return [...collectionKeys.activeListingsCurrencies, apiArgs] as const;
}

export function collectionActiveListingsCurrenciesQueryOptions(
	params: CollectionActiveListingsCurrenciesQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getCollectionActiveListingsCurrenciesQueryKey(params),
		queryFn: () =>
			fetchCollectionActiveListingsCurrencies({
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
