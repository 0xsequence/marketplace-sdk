import "../../index-C-745li7.js";
import { MarketplaceConfig, SdkConfig } from "../../create-config-DoEY40YQ.js";
import "../../index-BeRV-7AX.js";
import "../../index-Bxzjy0d1.js";
import "../../index-DwKr18CI.js";
import "../../index-D9LPlmbC.js";
import "../../index-CZ2ceZ6c.js";
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