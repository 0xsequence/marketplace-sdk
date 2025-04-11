import type { GetTokenBalancesReturn } from '@0xsequence/indexer';
import { infiniteQueryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import { OrderSide, type Page, type SdkConfig } from '../../types';
import { getIndexerClient } from '../_internal';
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
}

// Store state per collection
const stateByCollection = new Map<string, InventoryState>();

const getCollectionKey = (args: UseInventoryArgs) =>
	`${args.chainId}-${args.collectionAddress}-${args.accountAddress}`;

interface GetInventoryArgs extends Omit<UseInventoryArgs, 'query'> {
	isLaos721: boolean;
}

export async function fetchInventory(
	args: GetInventoryArgs,
	config: SdkConfig,
	page: Page,
) {
	const { accountAddress, collectionAddress, chainId, isLaos721 } = args;
	const collectionKey = getCollectionKey(args);

	if (!stateByCollection.has(collectionKey)) {
		stateByCollection.set(collectionKey, {
			seenTokenIds: new Set<string>(),
			marketplaceFinished: false,
		});
	}

	// biome-ignore lint/style/noNonNullAssertion: guaranteed to exist, by the above init
	const state = stateByCollection.get(collectionKey)!;

	// If marketplace API has no more results
	if (state.marketplaceFinished) {
		// Fetch from indexer using the provided page parameter
		const indexerClient = getIndexerClient(chainId, config);
		const balances = (await indexerClient.getTokenBalances({
			accountAddress,
			contractAddress: collectionAddress,
			includeMetadata: true,
			page: {
				page: page.page,
				pageSize: page.pageSize,
			},
		})) as GetTokenBalancesReturn;

		// Filter out balances that we've already seen
		const newBalances = balances.balances.filter(
			(balance) => !state.seenTokenIds.has(balance.tokenID ?? ''),
		);

		// Add new token IDs to the set
		for (const balance of newBalances) {
			state.seenTokenIds.add(balance.tokenID ?? '');
		}

		return {
			collectibles: newBalances.map((balance) => ({
				metadata: {
					tokenId: balance.tokenID ?? '',
					attributes: balance.tokenMetadata?.attributes,
					image: balance.tokenMetadata?.image,
					name: balance.tokenMetadata?.name,
					description: balance.tokenMetadata?.description,
					video: balance.tokenMetadata?.video,
					audio: balance.tokenMetadata?.audio,
				},
			})),
			page: {
				page: balances.page.page ?? page.page,
				pageSize: balances.page.pageSize ?? page.pageSize,
				more: newBalances.length > 0 && (balances.page.more ?? false),
			},
		};
	}

	// First try to fetch collectibles from the marketplace api
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

	// Add new token IDs to the set
	for (const c of collectibles.collectibles) {
		state.seenTokenIds.add(c.metadata.tokenId);
	}

	// If there are no more results from the marketplace api
	if (!collectibles.page?.more) {
		// Mark marketplace as finished and start indexer on next call
		state.marketplaceFinished = true;
		return {
			collectibles: collectibles.collectibles,
			page: {
				page: collectibles.page?.page ?? page.page,
				pageSize: collectibles.page?.pageSize ?? page.pageSize,
				more: true, // Force more to true so we'll try indexer next
			},
		};
	}

	return collectibles;
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
		// Reset state when the query is invalidated
		meta: {
			onInvalidate: () => {
				stateByCollection.delete(collectionKey);
			},
		},
	});
}
