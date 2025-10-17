import { getQueryClient } from "./api-DurLpRJc.js";
import { MetadataStatus } from "./marketplace.gen-f1f7WwwN.js";
import { compareAddress } from "./utils-CbjYu14V.js";
import { fetchMarketplaceConfig } from "./marketplaceConfig-BZPQoSvh.js";
import { tokenBalancesOptions } from "./tokenBalances-BQbbKg49.js";
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
	return { collectibles: (await getQueryClient().fetchQuery(tokenBalancesOptions({
		collectionAddress,
		userAddress: accountAddress,
		chainId,
		includeMetadata: true
	}, config))).map((balance) => collectibleFromTokenBalance(balance)) };
}
async function fetchInventory(args, config, page) {
	const { accountAddress, collectionAddress, chainId } = args;
	const isTradable = ((await fetchMarketplaceConfig({ config }))?.market.collections || []).some((collection) => compareAddress(collection.itemsAddress, collectionAddress));
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
	const enabled = (args.query?.enabled ?? true) && !!args.accountAddress && !!args.collectionAddress;
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
//# sourceMappingURL=inventory-C58knGjF.js.map