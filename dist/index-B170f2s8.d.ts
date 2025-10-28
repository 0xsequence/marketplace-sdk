import { Q as MarketplaceSdkContext, h as MarketplaceConfig, ia as WalletKind } from "./create-config-DL-Ld095.js";
import * as _tanstack_react_query273 from "@tanstack/react-query";

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
declare const useMarketplaceConfig: () => _tanstack_react_query273.UseQueryResult<MarketplaceConfig, Error>;
//#endregion
export { useConnectorMetadata as n, useConfig as r, useMarketplaceConfig as t };
//# sourceMappingURL=index-B170f2s8.d.ts.map