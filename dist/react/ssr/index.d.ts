import "../../index-BGbecJcg.js";
import { G as SdkConfig, c as MarketplaceConfig } from "../../create-config-BO68TZC5.js";
import "../../index-CuXR_VyQ.js";
import "../../index-CAM3wWOe.js";
import "../../index-D8lKsGSm.js";
import "../../index-B_xr1uHF.js";
import "../../index-DdjbZhKV.js";
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