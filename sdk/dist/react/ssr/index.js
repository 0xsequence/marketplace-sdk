import "../../builder.gen-B9wR2nvF.js";
import "../../builder-api-BFuZNOaN.js";
import { createWagmiConfig } from "../../create-config-C09hnk_V.js";
import "../../transaction-B7pHesqY.js";
import { getQueryClient } from "../../api-BwkAXGhb.js";
import "../../marketplace.gen-lc2B0D_7.js";
import "../../network-CuCj_F5Q.js";
import "../../_internal-DslqcNC1.js";
import "../../wagmi-BhP3mdhP.js";
import { marketplaceConfigOptions } from "../../marketplaceConfig-D0832T_-.js";
import { cookieToInitialState } from "wagmi";

//#region src/react/ssr/create-ssr-client.ts
const marketplaceConfig = async (config) => {
	const configOptions = marketplaceConfigOptions(config);
	return getQueryClient().fetchQuery(configOptions);
};
const initialState = async (args) => {
	const marketConfig = await marketplaceConfig(args.config);
	const wagmiConfig = createWagmiConfig(marketConfig, args.config, true);
	return { wagmi: cookieToInitialState(wagmiConfig, args.cookie) };
};
const createSSRClient = (args) => {
	const getMarketplaceConfig = async () => marketplaceConfig(args.config);
	const getInitialState = async () => initialState(args);
	const config = args.config;
	return {
		getInitialState,
		getMarketplaceConfig,
		config
	};
};

//#endregion
export { createSSRClient };
//# sourceMappingURL=index.js.map