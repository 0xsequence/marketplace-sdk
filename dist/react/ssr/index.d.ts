import "../../index-B6aSbaw2.js";
import { MarketplaceConfig, SdkConfig } from "../../create-config-sLNrdjHZ.js";
import "../../index-CT8ZorFd.js";
import "../../index-CM0ZTePs.js";
import "../../index-Bv5XVLjH.js";
import "../../index-Cg5cFzs-.js";
import "../../index-xLFVWPAf.js";
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