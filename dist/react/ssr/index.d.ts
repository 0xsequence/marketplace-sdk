import "../../index-CQX4mZlu.js";
import { Y as SdkConfig, h as MarketplaceConfig } from "../../create-config-BNLuQTqP.js";
import "../../index-D9IrGSb2.js";
import "../../index-CI16lywk.js";
import "../../index-B8u93xCG.js";
import "../../index-BZ-_n03s.js";
import "../../index-Dt3P5OqE.js";
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