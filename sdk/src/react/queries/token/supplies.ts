import type { GetTokenSuppliesArgs, Page } from '@0xsequence/indexer';
import { infiniteQueryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import { getIndexerClient, type ValuesOptional } from '../../_internal';
import type { StandardInfiniteQueryOptions } from '../../types/query';

export interface FetchTokenSuppliesParams
	extends Omit<GetTokenSuppliesArgs, 'contractAddress'> {
	chainId: number;
	collectionAddress: string;
	config: SdkConfig;
	page?: Page;
}

/**
 * Fetches token supplies with support for indexer API
 */
export async function fetchTokenSupplies(params: FetchTokenSuppliesParams) {
	const { chainId, collectionAddress, config, ...rest } = params;

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

export function getTokenSuppliesQueryKey(params: TokenSuppliesQueryOptions) {
	const apiArgs = {
		chainId: params.chainId!,
		contractAddress: params.collectionAddress!,
		includeMetadata: params.includeMetadata,
		metadataOptions: params.metadataOptions,
	};

	return ['token', 'supplies', apiArgs] as const;
}

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
			includeMetadata: params.includeMetadata,
			metadataOptions: params.metadataOptions,
			page: pageParam,
		});

	return infiniteQueryOptions({
		queryKey: getTokenSuppliesQueryKey(params),
		queryFn,
		initialPageParam,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
		...params.query,
		enabled,
	});
}
