import { ContractType } from "./marketplace.gen-HpnpL5xU.js";
import { useConfig } from "./useConfig-Ct2Tt1XY.js";
import { useMarketplaceConfig } from "./useMarketplaceConfig-C4vhw0Da.js";
import { inventoryOptions } from "./inventory-DWlv8o4I.js";
import { useInfiniteQuery } from "@tanstack/react-query";

//#region src/react/hooks/data/inventory/useInventory.tsx
function useInventory(args) {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const isLaos721 = marketplaceConfig?.market?.collections?.find((c) => c.itemsAddress === args.collectionAddress && c.chainId === args.chainId)?.contractType === ContractType.LAOS_ERC_721;
	return useInfiniteQuery(inventoryOptions({
		...args,
		isLaos721
	}, config));
}

//#endregion
export { useInventory };
//# sourceMappingURL=inventory-C0FII0BH.js.map