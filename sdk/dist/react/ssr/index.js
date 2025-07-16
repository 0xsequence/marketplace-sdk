import "../../builder.gen-B9wR2nvF.js";
import "../../builder-api-BFuZNOaN.js";
import { createWagmiConfig } from "../../create-config-fQ-jbJD1.js";
import "../../base-DqaJPvfN.js";
import "../../transaction-CnctdNzS.js";
import { getQueryClient } from "../../get-query-client-D19vvfJo.js";
import "../../api-BiMGqWdz.js";
import "../../marketplace.gen-HpnpL5xU.js";
import "../../network-CGD0oKtS.js";
import "../../get-provider-CYYHfrlg.js";
import "../../_internal-C75gOSNo.js";
import "../../wagmi-Do_KW5ke.js";
import { marketplaceConfigOptions } from "../../marketplaceConfig-GQTTmihy.js";
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