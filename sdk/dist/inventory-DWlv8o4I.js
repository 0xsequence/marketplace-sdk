import { LaosAPI, getIndexerClient } from "./api-BiMGqWdz.js";
import { OrderSide } from "./marketplace.gen-HpnpL5xU.js";
import { fetchMarketplaceConfig } from "./marketplaceConfig-GQTTmihy.js";
import { fetchListCollectibles } from "./listCollectibles-Dl3tB-_4.js";
import { infiniteQueryOptions } from "@tanstack/react-query";

//#region src/react/queries/inventory.ts
const stateByCollection = /* @__PURE__ */ new Map();
const clearInventoryState = () => {
	stateByCollection.clear();
};
const getCollectionKey = (args) => `${args.chainId}-${args.collectionAddress}-${args.accountAddress}`;
function getOrInitState(collectionKey) {
	if (!stateByCollection.has(collectionKey)) stateByCollection.set(collectionKey, {
		seenTokenIds: /* @__PURE__ */ new Set(),
		marketplaceFinished: false,
		indexerTokensFetched: false,
		indexerTokenBalances: /* @__PURE__ */ new Map()
	});
	return stateByCollection.get(collectionKey);
}
function collectibleFromTokenBalance(token) {
	return {
		metadata: {
			tokenId: token.tokenID ?? "",
			attributes: token.tokenMetadata?.attributes ?? [],
			image: token.tokenMetadata?.image,
			name: token.tokenMetadata?.name ?? "",
			description: token.tokenMetadata?.description,
			video: token.tokenMetadata?.video,
			audio: token.tokenMetadata?.audio
		},
		contractInfo: token.contractInfo,
		contractType: token.contractType,
		balance: token.balance
	};
}
async function fetchAllIndexerTokens(chainId, accountAddress, collectionAddress, config, state, isLaos721) {
	if (isLaos721) {
		const laosClient = new LaosAPI();
		const { balances } = await laosClient.getTokenBalances({
			chainId: chainId.toString(),
			accountAddress,
			includeMetadata: true,
			contractAddress: collectionAddress,
			page: { sort: [{
				column: "CREATED_AT",
				order: "DESC"
			}] }
		});
		for (const balance of balances) if (balance.tokenID) state.indexerTokenBalances.set(balance.tokenID, collectibleFromTokenBalance(balance));
		state.indexerTokensFetched = true;
		return;
	}
	const indexerClient = getIndexerClient(chainId, config);
	let page = { pageSize: 50 };
	while (true) {
		const { balances, page: nextPage } = await indexerClient.getTokenBalances({
			accountAddress,
			contractAddress: collectionAddress,
			includeMetadata: true,
			page
		});
		for (const balance of balances) if (balance.tokenID) state.indexerTokenBalances.set(balance.tokenID, collectibleFromTokenBalance(balance));
		if (!nextPage.more) break;
		page = nextPage;
	}
	state.indexerTokensFetched = true;
}
function processRemainingIndexerTokens(state, page) {
	const allTokens = Array.from(state.indexerTokenBalances.values());
	const newTokens = allTokens.filter((token) => !state.seenTokenIds.has(token.metadata.tokenId));
	const startIndex = (page.page - 1) * page.pageSize;
	const endIndex = startIndex + page.pageSize;
	const paginatedTokens = newTokens.slice(startIndex, endIndex);
	for (const token of paginatedTokens) state.seenTokenIds.add(token.metadata.tokenId);
	return {
		collectibles: paginatedTokens,
		page: {
			page: page.page,
			pageSize: page.pageSize,
			more: endIndex < newTokens.length
		}
	};
}
function processMarketplaceCollectibles(collectibles, state, page) {
	for (const c of collectibles) state.seenTokenIds.add(c.metadata.tokenId);
	const enrichedCollectibles = collectibles.map((c) => {
		const tokenId = c.metadata.tokenId;
		const indexerData = state.indexerTokenBalances.get(tokenId);
		return {
			...c,
			balance: indexerData?.balance,
			contractInfo: indexerData?.contractInfo,
			contractType: indexerData?.contractType
		};
	});
	const marketplaceTokenIds = new Set(enrichedCollectibles.map((c) => c.metadata.tokenId));
	const missingTokens = Array.from(state.indexerTokenBalances.entries()).filter(([tokenId]) => !marketplaceTokenIds.has(tokenId)).map(([_, balance]) => balance).slice(0, page.pageSize);
	return {
		enrichedCollectibles,
		missingTokens
	};
}
async function fetchInventory(args, config, page) {
	const { accountAddress, collectionAddress, chainId, isLaos721 } = args;
	const collectionKey = getCollectionKey(args);
	const state = getOrInitState(collectionKey);
	if (!state.indexerTokensFetched) await fetchAllIndexerTokens(chainId, accountAddress, collectionAddress, config, state, isLaos721);
	if (state.marketplaceFinished) return processRemainingIndexerTokens(state, page);
	const marketplaceConfig = await fetchMarketplaceConfig({ config });
	const collectibles = await fetchListCollectibles({
		chainId,
		collectionAddress,
		filter: {
			inAccounts: [accountAddress],
			includeEmpty: true
		},
		side: OrderSide.listing,
		config
	}, marketplaceConfig, page);
	const { enrichedCollectibles, missingTokens } = processMarketplaceCollectibles(collectibles.collectibles, state, page);
	if (!collectibles.page?.more) {
		state.marketplaceFinished = true;
		return {
			collectibles: [...enrichedCollectibles, ...missingTokens],
			page: {
				page: collectibles.page?.page ?? page.page,
				pageSize: collectibles.page?.pageSize ?? page.pageSize,
				more: missingTokens.length > 0
			}
		};
	}
	return {
		collectibles: enrichedCollectibles,
		page: {
			page: collectibles.page?.page ?? page.page,
			pageSize: collectibles.page?.pageSize ?? page.pageSize,
			more: Boolean(collectibles.page?.more)
		}
	};
}
function inventoryOptions(args, config) {
	const collectionKey = getCollectionKey(args);
	const enabledQuery = args.query?.enabled ?? true;
	const enabled = enabledQuery && !!args.accountAddress && !!args.collectionAddress;
	return infiniteQueryOptions({
		queryKey: [
			"inventory",
			args.accountAddress,
			args.collectionAddress,
			args.chainId
		],
		queryFn: ({ pageParam }) => fetchInventory({
			...args,
			isLaos721: args.isLaos721 ?? false
		}, config, pageParam),
		initialPageParam: {
			page: 1,
			pageSize: 30
		},
		getNextPageParam: (lastPage) => lastPage.page?.more ? lastPage.page : void 0,
		enabled,
		meta: { onInvalidate: () => {
			stateByCollection.delete(collectionKey);
		} }
	});
}

//#endregion
export { clearInventoryState, fetchInventory, inventoryOptions };
//# sourceMappingURL=inventory-DWlv8o4I.js.map