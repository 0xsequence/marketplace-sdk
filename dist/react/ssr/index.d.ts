import "../../index-D32EBH4Y.js";
import { MarketplaceConfig, SdkConfig } from "../../create-config-DrQDberp.js";
import "../../index-D88_7BZF.js";
import "../../index-B7xRWUfQ.js";
import "../../index-D_oTc4L4.js";
import "../../index-BWQPGpfS.js";
import "../../index-DMz_lg4Z.js";
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