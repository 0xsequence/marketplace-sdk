import "../../index-F2dcPzgs.js";
import { $ as SdkConfig, h as MarketplaceConfig } from "../../create-config-Cws5O44a.js";
import "../../index-B7MtKML6.js";
import "../../index-CfPlp-qD.js";
import "../../index-CFtPK2XD.js";
import "../../index-CxUQMgDN.js";
import "../../index-B6DLBWbq.js";
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
//# sourceMappingURL=index-YPKkkhZk.d.ts.map