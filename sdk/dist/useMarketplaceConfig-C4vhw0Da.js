import { useConfig } from "./useConfig-Ct2Tt1XY.js";
import { marketplaceConfigOptions } from "./marketplaceConfig-GQTTmihy.js";
import { useQuery } from "@tanstack/react-query";

//#region src/react/hooks/config/useMarketplaceConfig.tsx
const useMarketplaceConfig = () => {
	const config = useConfig();
	return useQuery(marketplaceConfigOptions(config));
};

//#endregion
export { useMarketplaceConfig };
//# sourceMappingURL=useMarketplaceConfig-C4vhw0Da.js.map