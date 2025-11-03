import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	collectableKeys,
	type GetPrimarySaleItemArgs,
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchPrimarySaleItemParams
	extends Omit<GetPrimarySaleItemArgs, 'chainId'> {
	chainId: number;
	config: SdkConfig;
}

/**
 * Fetches a single primary sale item from the marketplace API
 */
export async function fetchPrimarySaleItem(params: FetchPrimarySaleItemParams) {
	const { chainId, primarySaleContractAddress, tokenId, config } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: GetPrimarySaleItemArgs = {
		chainId: String(chainId),
		primarySaleContractAddress,
		tokenId,
	};

	const result = await marketplaceClient.getPrimarySaleItem(apiArgs);
	return result.item;
}

export type PrimarySaleItemQueryOptions =
	ValuesOptional<FetchPrimarySaleItemParams> & {
		query?: StandardQueryOptions;
	};

export function getPrimarySaleItemQueryKey(
	params: PrimarySaleItemQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		primarySaleContractAddress: params.primarySaleContractAddress,
		tokenId: params.tokenId,
	} satisfies QueryKeyArgs<GetPrimarySaleItemArgs>;

	return [...collectableKeys.primarySaleItem, apiArgs] as const;
}

export function primarySaleItemQueryOptions(
	params: PrimarySaleItemQueryOptions,
) {
	const enabled = Boolean(
		params.chainId &&
			params.primarySaleContractAddress &&
			params.tokenId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getPrimarySaleItemQueryKey(params),
		queryFn: () =>
			fetchPrimarySaleItem({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				primarySaleContractAddress: params.primarySaleContractAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				tokenId: params.tokenId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
