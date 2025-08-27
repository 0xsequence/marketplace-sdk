import "../../index-ChSKFOMx.js";
import { MarketplaceConfig, SdkConfig } from "../../create-config-Cg2OSDO8.js";
import "../../index-CtF7EE2z.js";
import "../../index-DX0Vm8HY.js";
import "../../index-QxxS6f9r.js";
import "../../index-q7f-WDBS.js";
import "../../index-qjZCr1jp.js";
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