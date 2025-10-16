import "../../builder.gen--XD71cNL.js";
import "../../builder-api-m4JAA6ee.js";
import "../../networkconfigToWagmiChain-ClZhwrUT.js";
import "../../transaction-DZUW5RHu.js";
import { createWagmiConfig$1 as createWagmiConfig } from "../../create-config-CRQrt3of.js";
import { getQueryClient } from "../../api-DBiZzw5L.js";
import "../../marketplace.gen-D_dVD9lc.js";
import "../../network-DwdZ_5-7.js";
import "../../_internal-MJWv57Fm.js";
import "../../wagmi-Bseovd6Q.js";
import { marketplaceConfigOptions$1 as marketplaceConfigOptions } from "../../marketplaceConfig-C_CT-yO3.js";
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