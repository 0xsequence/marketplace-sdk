import { Q as MarketplaceSdkContext, h as MarketplaceConfig, ia as WalletKind } from "./create-config.js";
import * as _tanstack_react_query119 from "@tanstack/react-query";

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
declare const useMarketplaceConfig: () => _tanstack_react_query119.UseQueryResult<MarketplaceConfig, Error>;
//#endregion
export { useConnectorMetadata as n, useConfig as r, useMarketplaceConfig as t };
//# sourceMappingURL=index8.d.ts.map