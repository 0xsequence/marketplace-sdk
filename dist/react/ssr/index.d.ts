import "../../index-CDr6-qTA.js";
import { MarketplaceConfig, SdkConfig } from "../../create-config-BpPJGqAC.js";
import "../../index-CGU8O29f.js";
import "../../index-Db978ma4.js";
import "../../index-DMdLa05u.js";
import "../../index-Cm91LriY.js";
import "../../index-DxTBWOSr.js";
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