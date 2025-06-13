import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	LaosAPI,
	type ValuesOptional,
	getIndexerClient,
	tokenSuppliesKeys,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface UseGetTokenSuppliesArgs {
	chainId: number;
	contractAddress: string;
	tokenId: string;
	isLaos721?: boolean;
}

export async function getTokenSupplies(
	args: UseGetTokenSuppliesArgs,
	config: SdkConfig,
) {
	if (args.isLaos721) {
		const laosApi = new LaosAPI();
		return laosApi.getTokenSupplies({
			chainId: args.chainId.toString(),
			contractAddress: args.contractAddress,
		});
	}

	const indexerClient = getIndexerClient(args.chainId, config);
	return await indexerClient.getTokenSupplies(args);
}

export function getTokenSuppliesOptions(
	args: UseGetTokenSuppliesArgs,
	config: SdkConfig,
) {
	return queryOptions({
		queryKey: ['getTokenSupplies', args],
		queryFn: () => getTokenSupplies(args, config),
	});
}

export interface FetchGetTokenSuppliesMapParams {
	chainId: number;
	collectionAddress: string;
	tokenIds: string[];
	config: SdkConfig;
}

/**
 * Fetches token supplies map from the indexer API
 */
export async function fetchGetTokenSuppliesMap(
	params: FetchGetTokenSuppliesMapParams,
) {
	const { chainId, collectionAddress, tokenIds, config } = params;
	const indexerClient = getIndexerClient(chainId, config);

	return indexerClient.getTokenSuppliesMap({
		tokenMap: {
			[collectionAddress]: tokenIds,
		},
		includeMetadata: false,
	});
}

export type GetTokenSuppliesMapQueryOptions =
	ValuesOptional<FetchGetTokenSuppliesMapParams> & {
		query?: StandardQueryOptions;
	};

export function getTokenSuppliesMapQueryOptions(
	params: GetTokenSuppliesMapQueryOptions,
) {
	const enabled = Boolean(
		params.chainId &&
			params.collectionAddress &&
			params.tokenIds?.length &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...tokenSuppliesKeys.maps, params],
		queryFn: () =>
			fetchGetTokenSuppliesMap({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				tokenIds: params.tokenIds!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
