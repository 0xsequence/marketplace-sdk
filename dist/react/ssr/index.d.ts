import "../../index-B6aSbaw2.js";
import { MarketplaceConfig, SdkConfig } from "../../create-config-D6v7S2xr.js";
import "../../index-DPJwQcVB.js";
import "../../index-Cy63dc6v.js";
import "../../index-BASx2eWn.js";
import "../../index-BeZnd2KI.js";
import "../../index-xSiDYJNs.js";
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