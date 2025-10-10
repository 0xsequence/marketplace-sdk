import "../../builder.gen-B9wR2nvF.js";
import "../../builder-api-BFuZNOaN.js";
import "../../networkconfigToWagmiChain-DbUf6HiO.js";
import "../../transaction-DZUW5RHu.js";
import { createWagmiConfig } from "../../create-config-CIfejoCk.js";
import { getQueryClient } from "../../api-lja0wRc1.js";
import "../../marketplace.gen-D9PUMxel.js";
import "../../network-DtmiMhcg.js";
import "../../_internal-DkS2VUn5.js";
import "../../wagmi-Bseovd6Q.js";
import { marketplaceConfigOptions } from "../../marketplaceConfig-CGF5eie1.js";
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