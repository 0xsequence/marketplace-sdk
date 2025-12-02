import "../../index-nVb7o0hc.js";
import { MarketplaceConfig, SdkConfig } from "../../create-config-CsagtMvq.js";
import "../../index-D-zXZSa1.js";
import "../../index-DD7Vc4cE.js";
import "../../index-isFvc5gd.js";
import "../../index-pbE88Tt7.js";
import "../../index-DZrogyT3.js";
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