import "../../index-BwnaOSXE.js";
import { MarketplaceConfig, SdkConfig } from "../../create-config-DxYEfdhK.js";
import "../../index-DqW_aQO1.js";
import "../../index-Bkn7LPPJ.js";
import "../../index-DfSLVc9d.js";
import "../../index-DewGsFz5.js";
import "../../index-LaD1JkWQ.js";
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