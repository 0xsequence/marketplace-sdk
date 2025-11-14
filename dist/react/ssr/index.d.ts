import "../../index-nVb7o0hc.js";
import { MarketplaceConfig, SdkConfig } from "../../create-config-rrEYvm6u.js";
import "../../index-8scPf0CS.js";
import "../../index-DD7Vc4cE.js";
import "../../index-isFvc5gd.js";
import "../../index-pbE88Tt7.js";
import "../../index-YkY-cmmu.js";
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