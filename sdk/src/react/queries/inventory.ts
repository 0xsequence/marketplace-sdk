import type {
	ContractInfo,
	Page as IndexerPage,
	TokenBalance,
} from '@0xsequence/indexer';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import { OrderSide, type SdkConfig } from '../../types';
import {
	type CollectibleOrder,
	type ContractType,
	getIndexerClient,
	ContractType as InternalContractType,
	LaosAPI,
	MetadataStatus,
	type ValuesOptional,
} from '../_internal';
import { inventoryKeys } from '../_internal/api/query-keys';
import type { StandardQueryOptions } from '../types/query';
import { fetchListCollectibles } from './listCollectibles';
import { fetchMarketplaceConfig } from './marketplaceConfig';

export interface CollectibleWithBalance extends CollectibleOrder {
	balance: string;
	contractInfo?: ContractInfo;
	contractType: ContractType.ERC1155 | ContractType.ERC721;
}

export interface FetchInventoryParams {
	chainId: number;
	collectionAddress: Address;
	accountAddress: Address;
	config: SdkConfig;
}

export interface InventoryQueryOptions
	extends ValuesOptional<FetchInventoryParams> {
	query?: StandardQueryOptions;
}

interface InventoryPageParam {
	page: number;
	pageSize: number;
	more: boolean;
	phase: 'marketplace' | 'indexer';
	marketplacePage: number;
	indexerPage: number;
	seenTokenIds?: string[];
}

export interface CollectiblesResponse {
	collectibles: CollectibleWithBalance[];
	page: InventoryPageParam;
}

function collectibleFromTokenBalance(
	token: TokenBalance,
): CollectibleWithBalance {
	return {
		metadata: {
			tokenId: token.tokenID ?? '',
			attributes: token.tokenMetadata?.attributes ?? [],
			image: token.tokenMetadata?.image,
			name: token.tokenMetadata?.name ?? '',
			description: token.tokenMetadata?.description,
			video: token.tokenMetadata?.video,
			audio: token.tokenMetadata?.audio,
			status: MetadataStatus.AVAILABLE,
		},
		contractInfo: token.contractInfo,
		contractType: token.contractType as unknown as
			| ContractType.ERC1155
			| ContractType.ERC721,
		balance: token.balance,
	};
}

async function fetchAllIndexerTokens(
	chainId: number,
	accountAddress: Address,
	collectionAddress: Address,
	config: SdkConfig,
	isLaos721: boolean,
): Promise<CollectibleWithBalance[]> {
	const tokens: CollectibleWithBalance[] = [];

	if (isLaos721) {
		const laosClient = new LaosAPI();
		const { balances } = await laosClient.getTokenBalances({
			chainId: chainId.toString(),
			accountAddress,
			includeMetadata: true,
			contractAddress: collectionAddress,
			page: {
				sort: [
					{
						column: 'CREATED_AT',
						order: 'DESC',
					},
				],
			},
		});

		for (const balance of balances) {
			tokens.push(collectibleFromTokenBalance(balance));
		}

		return tokens;
	}

	const indexerClient = getIndexerClient(chainId, config);

	let page: IndexerPage = {
		pageSize: 50,
	};

	while (true) {
		const { balances, page: nextPage } = await indexerClient.getTokenBalances({
			accountAddress,
			contractAddress: collectionAddress,
			includeMetadata: true,
			page: page,
		});

		for (const balance of balances) {
			tokens.push(collectibleFromTokenBalance(balance));
		}

		if (!nextPage.more) {
			break;
		}
		page = nextPage;
	}

	return tokens;
}

export async function fetchInventory(
	args: FetchInventoryParams,
	pageParam: InventoryPageParam,
	indexerMap: Map<string, CollectibleWithBalance>,
): Promise<CollectiblesResponse> {
	const { accountAddress, collectionAddress, chainId, config } = args;

	const seenTokenIds = new Set(pageParam.seenTokenIds || []);

	if (pageParam.phase === 'marketplace') {
		const collectibles = await fetchListCollectibles(
			{
				chainId,
				collectionAddress,
				filter: {
					inAccounts: [accountAddress],
					includeEmpty: true,
				},
				side: OrderSide.listing,
				config,
			},
			{ page: pageParam.marketplacePage, pageSize: pageParam.pageSize },
		);

		const enrichedCollectibles = collectibles.collectibles.map(
			(c: CollectibleOrder) => {
				const indexerData = indexerMap.get(c.metadata.tokenId);
				return {
					...c,
					balance: indexerData?.balance,
					contractInfo: indexerData?.contractInfo,
					contractType: indexerData?.contractType,
				} as CollectibleWithBalance;
			},
		);

		for (const c of enrichedCollectibles) {
			seenTokenIds.add(c.metadata.tokenId);
		}

		if (collectibles.page?.more) {
			return {
				collectibles: enrichedCollectibles,
				page: {
					page: pageParam.page,
					pageSize: pageParam.pageSize,
					more: true,
					phase: 'marketplace',
					marketplacePage: pageParam.marketplacePage + 1,
					indexerPage: 1,
					seenTokenIds: Array.from(seenTokenIds),
				},
			};
		}

		const allIndexerTokens = Array.from(indexerMap.values());
		const unseenTokens = allIndexerTokens.filter(
			(t) => !seenTokenIds.has(t.metadata.tokenId),
		);

		if (unseenTokens.length === 0) {
			return {
				collectibles: enrichedCollectibles,
				page: {
					page: pageParam.page,
					pageSize: pageParam.pageSize,
					more: false,
					phase: 'marketplace',
					marketplacePage: pageParam.marketplacePage,
					indexerPage: 1,
					seenTokenIds: Array.from(seenTokenIds),
				},
			};
		}

		if (enrichedCollectibles.length > 0) {
			return {
				collectibles: enrichedCollectibles,
				page: {
					page: pageParam.page,
					pageSize: pageParam.pageSize,
					more: true,
					phase: 'indexer',
					marketplacePage: pageParam.marketplacePage,
					indexerPage: 1,
					seenTokenIds: Array.from(seenTokenIds),
				},
			};
		}

		const firstBatch = unseenTokens.slice(0, pageParam.pageSize);
		for (const t of firstBatch) {
			seenTokenIds.add(t.metadata.tokenId);
		}

		return {
			collectibles: firstBatch,
			page: {
				page: pageParam.page,
				pageSize: pageParam.pageSize,
				more: unseenTokens.length > firstBatch.length,
				phase: 'indexer',
				marketplacePage: pageParam.marketplacePage,
				indexerPage: 2,
				seenTokenIds: Array.from(seenTokenIds),
			},
		};
	}

	const allIndexerTokens = Array.from(indexerMap.values());
	const unseenTokens = allIndexerTokens.filter(
		(t) => !seenTokenIds.has(t.metadata.tokenId),
	);

	const startIndex = (pageParam.indexerPage - 1) * pageParam.pageSize;
	const endIndex = startIndex + pageParam.pageSize;
	const paginatedTokens = unseenTokens.slice(startIndex, endIndex);

	for (const t of paginatedTokens) {
		seenTokenIds.add(t.metadata.tokenId);
	}

	const hasMore = endIndex < unseenTokens.length;

	return {
		collectibles: paginatedTokens,
		page: {
			page: pageParam.page,
			pageSize: pageParam.pageSize,
			more: hasMore,
			phase: 'indexer',
			marketplacePage: pageParam.marketplacePage,
			indexerPage: pageParam.indexerPage + 1,
			seenTokenIds: Array.from(seenTokenIds),
		},
	};
}

export function indexerQueryOptions(params: InventoryQueryOptions) {
	const enabled = Boolean(
		params.accountAddress &&
			params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: inventoryKeys._indexer(
			params.collectionAddress!,
			params.chainId!,
			params.accountAddress!,
		),
		queryFn: async () => {
			const marketplaceConfig = await fetchMarketplaceConfig({
				config: params.config!,
			});
			const isLaos721 =
				marketplaceConfig?.market?.collections?.find(
					(c) =>
						c.itemsAddress === params.collectionAddress &&
						c.chainId === params.chainId,
				)?.contractType === InternalContractType.LAOS_ERC_721;

			const tokens = await fetchAllIndexerTokens(
				params.chainId!,
				params.accountAddress!,
				params.collectionAddress!,
				params.config!,
				isLaos721 ?? false,
			);

			return new Map(tokens.map((t) => [t.metadata.tokenId, t]));
		},
		enabled,
		staleTime: 30_000,
		...params.query,
	});
}

export function inventoryQueryOptions(
	params: InventoryQueryOptions,
	indexerMap: Map<string, CollectibleWithBalance> | undefined,
) {
	const enabledQuery = params.query?.enabled ?? true;
	const enabled =
		enabledQuery &&
		!!params.accountAddress &&
		!!params.collectionAddress &&
		!!params.chainId &&
		!!params.config &&
		!!indexerMap;

	return infiniteQueryOptions({
		queryKey: inventoryKeys.user(
			params.collectionAddress!,
			params.chainId!,
			params.accountAddress!,
		),
		queryFn: ({ pageParam }) =>
			fetchInventory(
				{
					chainId: params.chainId!,
					collectionAddress: params.collectionAddress!,
					accountAddress: params.accountAddress!,
					config: params.config!,
				},
				pageParam,
				indexerMap!,
			),
		initialPageParam: {
			page: 1,
			pageSize: 30,
			more: false,
			phase: 'marketplace' as const,
			marketplacePage: 1,
			indexerPage: 1,
		} as InventoryPageParam,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more
				? {
						...lastPage.page,
						page: lastPage.page.page + 1,
					}
				: undefined,
		enabled,
		staleTime: 10_000,
		...params.query,
	});
}

export function getInventoryQueryKey(
	collectionAddress: string,
	chainId: number,
	accountAddress: string,
) {
	return inventoryKeys.user(collectionAddress, chainId, accountAddress);
}
