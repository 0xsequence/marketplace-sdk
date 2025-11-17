import "../../index-F2dcPzgs.js";
import { $ as SdkConfig, h as MarketplaceConfig } from "../../create-config-CrbgqkBr.js";
import "../../index-vq8mN0Zr.js";
import "../../index-CfPlp-qD.js";
import "../../index-CFtPK2XD.js";
import "../../index-CxUQMgDN.js";
import "../../index-SnwhZaAE.js";
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
//# sourceMappingURL=index-C81hQS0A.d.ts.map