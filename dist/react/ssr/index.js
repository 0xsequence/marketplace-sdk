import "../../builder.gen-B9wR2nvF.js";
import "../../builder-api-BFuZNOaN.js";
import { createWagmiConfig } from "../../create-config-6uynwTeb.js";
import "../../transaction-CC2KxNF6.js";
import { getQueryClient } from "../../api-BmEQfSQa.js";
import "../../marketplace.gen-JzNYpM0U.js";
import "../../network-DnBEe1Ur.js";
import "../../_internal-DslqcNC1.js";
import "../../wagmi-BhP3mdhP.js";
import { marketplaceConfigOptions } from "../../marketplaceConfig-sNh-MA5M.js";
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