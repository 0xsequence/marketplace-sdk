import type {
	ContractInfo,
	Page as IndexerPage,
	TokenBalance,
} from '@0xsequence/indexer';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import { OrderSide, type Page, type SdkConfig } from '../../types';
import { compareAddress } from '../../utils';
import {
	type CollectibleOrder,
	type ContractType,
	getIndexerClient,
	LaosAPI,
} from '../_internal';
import { fetchListCollectibles } from './listCollectibles';
import { fetchMarketplaceConfig } from './marketplaceConfig';

export interface UseInventoryArgs {
	accountAddress: Address;
	collectionAddress: Address;
	chainId: number;
	isLaos721?: boolean;
	includeNonTradable?: boolean;
	query?: {
		enabled?: boolean;
		page?: number;
		pageSize?: number;
	};
}

// Maintain collection state across calls
interface InventoryState {
	seenTokenIds: Set<string>;
	marketFinished: boolean;
	// Track if we've already fetched all indexer tokens
	indexerTokensFetched: boolean;
	// Store the token balances from the indexer
	indexerTokenBalances: Map<string, CollectibleWithBalance>;
}

// Store state per collection
const stateByCollection = new Map<string, InventoryState>();

// Test helper to clear state between tests
export const clearInventoryState = () => {
	stateByCollection.clear();
};

const getCollectionKey = (args: UseInventoryArgs) =>
	`${args.chainId}-${args.collectionAddress}-${args.accountAddress}`;

interface GetInventoryArgs extends Omit<UseInventoryArgs, 'query'> {
	isLaos721: boolean;
}

interface CollectibleWithBalance extends CollectibleOrder {
	balance: string;
	contractInfo?: ContractInfo;
	contractType: ContractType.ERC1155 | ContractType.ERC721;
}

export interface CollectiblesResponse {
	collectibles: CollectibleWithBalance[];
	page: Page;
	isTradable: boolean;
}

function getOrInitState(collectionKey: string): InventoryState {
	if (!stateByCollection.has(collectionKey)) {
		stateByCollection.set(collectionKey, {
			seenTokenIds: new Set<string>(),
			marketFinished: false,
			indexerTokensFetched: false,
			indexerTokenBalances: new Map(),
		});
	}

	// biome-ignore lint/style/noNonNullAssertion: guaranteed to exist, by the above init
	return stateByCollection.get(collectionKey)!;
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
	state: InventoryState,
	isLaos721: boolean,
): Promise<void> {
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
			if (balance.tokenID) {
				state.indexerTokenBalances.set(
					balance.tokenID,
					collectibleFromTokenBalance(balance),
				);
			}
		}

		state.indexerTokensFetched = true;
		return;
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
			if (balance.tokenID) {
				state.indexerTokenBalances.set(
					balance.tokenID,
					collectibleFromTokenBalance(balance),
				);
			}
		}

		if (!nextPage.more) {
			break;
		}
		page = nextPage;
	}

	state.indexerTokensFetched = true;
}

// Process indexer tokens that we haven't seen yet
function processRemainingIndexerTokens(
	state: InventoryState,
	page: Page,
	isTradable: boolean,
): CollectiblesResponse {
	const allTokens = Array.from(state.indexerTokenBalances.values());

	// Filter out tokens that we've already seen
	const newTokens = allTokens.filter(
		(token) => !state.seenTokenIds.has(token.metadata.tokenId),
	);

	// Calculate pagination
	const startIndex = (page.page - 1) * page.pageSize;
	const endIndex = startIndex + page.pageSize;
	const paginatedTokens = newTokens.slice(startIndex, endIndex);

	// Add new token IDs to the set
	for (const token of paginatedTokens) {
		state.seenTokenIds.add(token.metadata.tokenId);
	}

	return {
		collectibles: paginatedTokens,
		page: {
			page: page.page,
			pageSize: page.pageSize,
			more: endIndex < newTokens.length,
		},
		isTradable,
	};
}

function processMarketCollectibles(
	collectibles: CollectibleOrder[],
	state: InventoryState,
	page: Page,
): {
	enrichedCollectibles: CollectibleWithBalance[];
	missingTokens: CollectibleWithBalance[];
} {
	// Add new token IDs to the set
	for (const c of collectibles) {
		state.seenTokenIds.add(c.metadata.tokenId);
	}

	// Enrich market collectibles with balance data from indexer
	const enrichedCollectibles = collectibles.map((c: CollectibleOrder) => {
		const tokenId = c.metadata.tokenId;
		const indexerData = state.indexerTokenBalances.get(tokenId);

		return {
			...c,
			balance: indexerData?.balance,
			contractInfo: indexerData?.contractInfo,
			contractType: indexerData?.contractType,
		} as CollectibleWithBalance;
	});

	// Check for missing tokens in the market data
	const marketTokenIds = new Set(
		enrichedCollectibles.map((c) => c.metadata.tokenId),
	);

	const missingTokens = Array.from(state.indexerTokenBalances.entries())
		.filter(([tokenId]) => !marketTokenIds.has(tokenId))
		.map(([_, balance]) => balance)
		.slice(0, page.pageSize);

	return { enrichedCollectibles, missingTokens };
}

export async function fetchInventory(
	args: GetInventoryArgs,
	config: SdkConfig,
	page: Page,
): Promise<CollectiblesResponse> {
	const { accountAddress, collectionAddress, chainId, isLaos721 } = args;
	const collectionKey = getCollectionKey(args);
	const state = getOrInitState(collectionKey);
	const marketplaceConfig = await fetchMarketplaceConfig({ config });

	const marketCollections = marketplaceConfig?.market.collections || [];

	const isMarketCollection = marketCollections.some((collection) =>
		compareAddress(collection.itemsAddress, collectionAddress),
	);

	// On first run, fetch all pages from the indexer
	if (!state.indexerTokensFetched) {
		await fetchAllIndexerTokens(
			chainId,
			accountAddress,
			collectionAddress,
			config,
			state,
			isLaos721,
		);
	}

	// Determine if this collection is tradable (market collection vs shop collection)
	const isTradable = isMarketCollection;

	// If marketplace API has no more results, use the indexer data
	if (state.marketFinished) {
		return processRemainingIndexerTokens(state, page, isTradable);
	}

	// Fetch collectibles from marketplace API
	const marketCollectibles = await fetchListCollectibles(
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
		page,
	);

	// Process the collectibles and find missing tokens
	const { enrichedCollectibles: enrichedMarketCollectibles, missingTokens } =
		processMarketCollectibles(marketCollectibles.collectibles, state, page);

	// If there are no more results from the marketplace API
	if (!marketCollectibles.page?.more) {
		// Mark market as finished and start using indexer data on next call
		state.marketFinished = true;
		return {
			collectibles: [...enrichedMarketCollectibles, ...missingTokens],
			page: {
				page: marketCollectibles.page?.page ?? page.page,
				pageSize: marketCollectibles.page?.pageSize ?? page.pageSize,
				more: missingTokens.length > 0,
			},
			isTradable,
		};
	}

	return {
		collectibles: enrichedMarketCollectibles,
		page: {
			page: marketCollectibles.page?.page ?? page.page,
			pageSize: marketCollectibles.page?.pageSize ?? page.pageSize,
			more: Boolean(marketCollectibles.page?.more),
		},
		isTradable,
	};
}

export function inventoryOptions(args: UseInventoryArgs, config: SdkConfig) {
	const collectionKey = getCollectionKey(args);
	const enabledQuery = args.query?.enabled ?? true;
	const enabled =
		enabledQuery && !!args.accountAddress && !!args.collectionAddress;

	return queryOptions({
		queryKey: [
			'inventory',
			args.accountAddress,
			args.collectionAddress,
			args.chainId,
			args.query?.page ?? 1,
			args.query?.pageSize ?? 30,
		],
		queryFn: () =>
			fetchInventory(
				{
					...args,
					isLaos721: args.isLaos721 ?? false,
				},
				config,
				{
					page: args.query?.page ?? 1,
					pageSize: args.query?.pageSize ?? 30,
				},
			),
		enabled,
		meta: {
			onInvalidate: () => {
				stateByCollection.delete(collectionKey);
			},
		},
	});
}
