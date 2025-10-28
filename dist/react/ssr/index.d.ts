import "../../index-B3ZUoCbJ.js";
import { $ as SdkConfig, h as MarketplaceConfig } from "../../create-config-nZqvb8A7.js";
import "../../index-CrNFuqml.js";
import "../../index-B3EZVwXZ.js";
import "../../index-ClkKaWBZ.js";
import "../../index-BgcGm5sE.js";
import "../../index-BP19XXtv.js";
import { State } from "wagmi";

//#region src/react/ssr/create-ssr-client.d.ts
type InitSSRClientArgs = {
  cookie: string;
  config: SdkConfig;
};
type InitialState = {
  wagmi?: State;
};
declare const createSSRClient: (args: InitSSRClientArgs) => {
  getInitialState: () => Promise<InitialState>;
  getMarketplaceConfig: () => Promise<MarketplaceConfig>;
  config: SdkConfig;
};
//#endregion
export { createSSRClient };
//# sourceMappingURL=index.d.ts.map