import type { GetTokenSuppliesArgs, Page } from '@0xsequence/indexer';
import { infiniteQueryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	getIndexerClient,
	LaosAPI,
	tokenKeys,
	type ValuesOptional,
} from '../_internal';
import type { StandardInfiniteQueryOptions } from '../types/query';

export interface FetchTokenSuppliesParams
	extends Omit<GetTokenSuppliesArgs, 'contractAddress'> {
	chainId: number;
	collectionAddress: string;
	config: SdkConfig;
	isLaos721?: boolean;
	page?: Page;
}

/**
 * Fetches token supplies with support for both indexer and LAOS APIs
 * Uses the more efficient single-contract APIs from both services
 */
export async function fetchTokenSupplies(params: FetchTokenSuppliesParams) {
	const { chainId, collectionAddress, config, isLaos721, ...rest } = params;

	if (isLaos721) {
		const laosApi = new LaosAPI();

		// Convert indexer Page format to LAOS PaginationOptions format
		const laosPage = rest.page
			? {
					sort:
						rest.page.sort?.map((sortBy) => ({
							column: sortBy.column,
							order: sortBy.order,
						})) || [],
				}
			: undefined;

		const result = await laosApi.getTokenSupplies({
			chainId: chainId.toString(),
			contractAddress: collectionAddress,
			includeMetadata: rest.includeMetadata,
			page: laosPage,
		});

		return result;
	}

	const indexerClient = getIndexerClient(chainId, config);

	const apiArgs: GetTokenSuppliesArgs = {
		contractAddress: collectionAddress,
		...rest,
	};

	const result = await indexerClient.getTokenSupplies(apiArgs);
	return result;
}

export type TokenSuppliesQueryOptions =
	ValuesOptional<FetchTokenSuppliesParams> & {
		query?: StandardInfiniteQueryOptions;
	};

export function tokenSuppliesQueryOptions(params: TokenSuppliesQueryOptions) {
	const enabled = Boolean(
		params.chainId &&
			params.collectionAddress &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	const initialPageParam = { page: 1, pageSize: 30 } as Page;

	const queryFn = async ({ pageParam = initialPageParam }) =>
		fetchTokenSupplies({
			// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
			chainId: params.chainId!,
			// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
			collectionAddress: params.collectionAddress!,
			// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
			config: params.config!,
			isLaos721: params.isLaos721,
			includeMetadata: params.includeMetadata,
			metadataOptions: params.metadataOptions,
			page: pageParam,
		});

	return infiniteQueryOptions({
		queryKey: [...tokenKeys.supplies, params],
		queryFn,
		initialPageParam,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
		...params.query,
		enabled,
	});
}
