import { getQueryClient } from "./api-GwTR0dBA.js";
import { MetadataStatus$1 as MetadataStatus } from "./marketplace.gen-906FrJQJ.js";
import { compareAddress } from "./utils-9ToOvt-c.js";
import { fetchMarketplaceConfig$1 as fetchMarketplaceConfig } from "./marketplaceConfig-Bqjo7NYO.js";
import { tokenBalancesOptions$1 as tokenBalancesOptions } from "./tokenBalances-CouzNX4j.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/queries/inventory/inventory.ts
function collectibleFromTokenBalance(token) {
	return {
		metadata: {
			tokenId: token.tokenID ?? "",
			attributes: token.tokenMetadata?.attributes ?? [],
			image: token.tokenMetadata?.image,
			name: token.tokenMetadata?.name ?? "",
			description: token.tokenMetadata?.description,
			video: token.tokenMetadata?.video,
			audio: token.tokenMetadata?.audio,
			status: MetadataStatus.AVAILABLE
		},
		contractInfo: token.contractInfo,
		contractType: token.contractType,
		balance: token.balance
	};
}
async function fetchIndexerTokens(chainId, accountAddress, collectionAddress, config) {
	const queryClient = getQueryClient();
	const balances = await queryClient.fetchQuery(tokenBalancesOptions({
		collectionAddress,
		userAddress: accountAddress,
		chainId,
		includeMetadata: true
	}, config));
	const collectibles = balances.map((balance) => collectibleFromTokenBalance(balance));
	return { collectibles };
}
async function fetchInventory(args, config, page) {
	const { accountAddress, collectionAddress, chainId } = args;
	const marketplaceConfig = await fetchMarketplaceConfig({ config });
	const marketCollections = marketplaceConfig?.market.collections || [];
	const isMarketCollection = marketCollections.some((collection) => compareAddress(collection.itemsAddress, collectionAddress));
	const isTradable = isMarketCollection;
	const { collectibles } = await fetchIndexerTokens(chainId, accountAddress, collectionAddress, config);
	return {
		collectibles,
		page: {
			page: page.page,
			pageSize: page.pageSize
		},
		isTradable
	};
}
function inventoryOptions(args, config) {
	const enabledQuery = args.query?.enabled ?? true;
	const enabled = enabledQuery && !!args.accountAddress && !!args.collectionAddress;
	return queryOptions({
		queryKey: [
			"inventory",
			args.accountAddress,
			args.collectionAddress,
			args.chainId,
			args.query?.page ?? 1,
			args.query?.pageSize ?? 30
		],
		queryFn: () => fetchInventory({ ...args }, config, {
			page: args.query?.page ?? 1,
			pageSize: args.query?.pageSize ?? 30
		}),
		enabled
	});
}

//#endregion
export { fetchInventory, inventoryOptions };
//# sourceMappingURL=inventory--t6Zu55O.js.map