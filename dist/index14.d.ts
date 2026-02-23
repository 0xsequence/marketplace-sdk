import { wn as WalletKind } from "./index2.js";
import { p as MarketplaceConfig, s as MarketplaceSdkContext } from "./create-config.js";
import * as _tanstack_react_query404 from "@tanstack/react-query";

//#region src/react/hooks/config/useConfig.d.ts
declare function useConfig(): MarketplaceSdkContext;
//#endregion
//#region src/react/hooks/config/useConnectorMetadata.d.ts
declare const useConnectorMetadata: () => {
  isWaaS: boolean;
  isSequence: boolean | undefined;
  walletKind: WalletKind;
};
//#endregion
//#region src/react/hooks/config/useMarketplaceConfig.d.ts
declare const useMarketplaceConfig: () => _tanstack_react_query404.UseQueryResult<MarketplaceConfig, Error>;
//#endregion
export { useConnectorMetadata as n, useConfig as r, useMarketplaceConfig as t };
//# sourceMappingURL=index14.d.ts.map