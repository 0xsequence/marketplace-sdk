import "../../index-B6aSbaw2.js";
import { MarketplaceConfig, SdkConfig } from "../../new-marketplace-types-Cggo50UM.js";
import "../../builder-api-7g5a_lFO.js";
import "../../index-BJX84qr6.js";
import "../../create-config-BgVYLBpS.js";
import "../../index-ES0FbwuU.js";
import "../../index-DOlDAkgf.js";
import "../../index-HF4U5n4j.js";
import "../../index-DE1muTvw.js";
import "../../index-DSvqS_oI.js";
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