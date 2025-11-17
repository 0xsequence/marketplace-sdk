import "../../builder.gen-Dfid-L2J.js";
import "../../builder-api-DejJMpOg.js";
import "../../networkconfigToWagmiChain-DdqPXVKK.js";
import "../../transaction-SFATdYo0.js";
import { t as createWagmiConfig } from "../../create-config-Bn-hVsF4.js";
import { _ as getQueryClient } from "../../api-aX60quJA.js";
import "../../marketplace.gen-tQfigxXM.js";
import "../../network-Zt0ue9MC.js";
import "../../_internal-D0QriMWb.js";
import "../../wagmi-C6YOhF77.js";
import { n as marketplaceConfigOptions } from "../../marketplaceConfig-DsDqJlRk.js";
import { cookieToInitialState } from "wagmi";

//#region src/react/ssr/create-ssr-client.ts
const marketplaceConfig = async (config) => {
	const configOptions = marketplaceConfigOptions(config);
	return getQueryClient().fetchQuery(configOptions);
};
const initialState = async (args) => {
	return { wagmi: cookieToInitialState(createWagmiConfig(await marketplaceConfig(args.config), args.config, true), args.cookie) };
};
const createSSRClient = (args) => {
	const getMarketplaceConfig = async () => marketplaceConfig(args.config);
	const getInitialState = async () => initialState(args);
	return {
		getInitialState,
		getMarketplaceConfig,
		config: args.config
	};
};

//#endregion
export { createSSRClient };
//# sourceMappingURL=index.js.map