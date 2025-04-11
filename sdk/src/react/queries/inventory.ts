import type { Page as IndexerPage, TokenBalance } from '@0xsequence/indexer';
import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import { OrderSide, type Page, type SdkConfig } from '../../types';
import { type CollectibleOrder, getIndexerClient } from '../_internal';
import { fetchCollectibles } from './listCollectibles';

export interface UseInventoryArgs {
	accountAddress: Address;
	collectionAddress: Address;
	chainId: number;
	query?: {
		enabled?: boolean;
	};
}

// Maintain collection state across calls
interface InventoryState {
	seenTokenIds: Set<string>;
	marketplaceFinished: boolean;
	// Track if we've already fetched all indexer tokens
	indexerTokensFetched: boolean;
	// Store the token balances from the indexer
	indexerTokenBalances: Map<string, CollectibleWithBalance>;
}

// Store state per collection
const stateByCollection = new Map<string, InventoryState>();

const getCollectionKey = (args: UseInventoryArgs) =>
	`${args.chainId}-${args.collectionAddress}-${args.accountAddress}`;

interface GetInventoryArgs extends Omit<UseInventoryArgs, 'query'> {
	isLaos721: boolean;
}

interface CollectibleWithBalance extends CollectibleOrder {
	balance: string;
}

interface CollectiblesResponse {
	collectibles: CollectibleWithBalance[];
	page: Page;
}

function getOrInitState(collectionKey: string): InventoryState {
	if (!stateByCollection.has(collectionKey)) {
		stateByCollection.set(collectionKey, {
			seenTokenIds: new Set<string>(),
			marketplaceFinished: false,
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
		balance: token.balance,
	};
}

async function fetchAllIndexerTokens(
	chainId: number,
	accountAddress: Address,
	collectionAddress: Address,
	config: SdkConfig,
	state: InventoryState,
): Promise<void> {
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
	};
}

function processMarketplaceCollectibles(
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

	// Enrich marketplace collectibles with balance data from indexer
	const enrichedCollectibles = collectibles.map((c: CollectibleOrder) => {
		const tokenId = c.metadata.tokenId;
		const indexerData = state.indexerTokenBalances.get(tokenId);

		return {
			...c,
			balance: indexerData?.balance,
		} as CollectibleWithBalance;
	});

	// Check for missing tokens in the marketplace data
	const marketplaceTokenIds = new Set(
		enrichedCollectibles.map((c) => c.metadata.tokenId),
	);

	const missingTokens = Array.from(state.indexerTokenBalances.entries())
		.filter(([tokenId]) => !marketplaceTokenIds.has(tokenId))
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

	// On first run, fetch all pages from the indexer
	if (!state.indexerTokensFetched) {
		await fetchAllIndexerTokens(
			chainId,
			accountAddress,
			collectionAddress,
			config,
			state,
		);
	}

	// If marketplace API has no more results, use the indexer data
	if (state.marketplaceFinished) {
		return processRemainingIndexerTokens(state, page);
	}

	// Fetch collectibles from marketplace API
	const collectibles = await fetchCollectibles(
		{
			chainId,
			collectionAddress,
			filter: {
				inAccounts: [accountAddress],
				includeEmpty: true,
			},
			side: OrderSide.listing,
			isLaos721,
		},
		config,
		page,
	);

	// Process the collectibles and find missing tokens
	const { enrichedCollectibles, missingTokens } =
		processMarketplaceCollectibles(collectibles.collectibles, state, page);

	// If there are no more results from the marketplace API
	if (!collectibles.page?.more) {
		// Mark marketplace as finished and start using indexer data on next call
		state.marketplaceFinished = true;
		return {
			collectibles: [...enrichedCollectibles, ...missingTokens],
			page: {
				page: collectibles.page?.page ?? page.page,
				pageSize: collectibles.page?.pageSize ?? page.pageSize,
				more: missingTokens.length > 0,
			},
		};
	}

	return {
		collectibles: enrichedCollectibles,
		page: {
			page: collectibles.page?.page ?? page.page,
			pageSize: collectibles.page?.pageSize ?? page.pageSize,
			more: Boolean(collectibles.page?.more),
		},
	};
}

export function inventoryOptions(args: UseInventoryArgs, config: SdkConfig) {
	const collectionKey = getCollectionKey(args);

	return infiniteQueryOptions({
		queryKey: [
			'inventory',
			args.accountAddress,
			args.collectionAddress,
			args.chainId,
		],
		queryFn: ({ pageParam }) =>
			fetchInventory(
				{
					...args,
					isLaos721: false, // TODO: Get this from collection details
				},
				config,
				pageParam,
			),
		initialPageParam: { page: 1, pageSize: 30 } as Page,
		getNextPageParam: (lastPage) =>
			lastPage.page?.more ? lastPage.page : undefined,
		enabled: args.query?.enabled ?? true,
		meta: {
			onInvalidate: () => {
				stateByCollection.delete(collectionKey);
			},
		},
	});
}
