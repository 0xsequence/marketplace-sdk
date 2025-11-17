import "../../index-F2dcPzgs.js";
import { $ as SdkConfig, h as MarketplaceConfig } from "../../create-config-BA_ne-vj.js";
import "../../index-RtmPrz37.js";
import "../../index-CfPlp-qD.js";
import "../../index-CFtPK2XD.js";
import "../../index-CxUQMgDN.js";
import "../../index-CLRRV8WQ.js";
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
//# sourceMappingURL=index-DMwv9j5w.d.ts.map