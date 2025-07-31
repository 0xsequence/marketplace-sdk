import "../../index-B7ljb0yH.js";
import { MarketplaceConfig, SdkConfig } from "../../create-config-CpiC1m8h.js";
import "../../index-BlCpdFHa.js";
import "../../index-67NkQkE4.js";
import "../../index-gY6XT6oA.js";
import "../../index-BIsCUWAs.js";
import "../../index-ve_UNjUo.js";
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