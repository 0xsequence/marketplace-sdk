import { MarketplaceConfig, MarketplaceSdkContext, WalletKind } from "./create-config-goz-zUX1.js";
import * as _tanstack_react_query268 from "@tanstack/react-query";

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
declare const useMarketplaceConfig: () => _tanstack_react_query268.UseQueryResult<MarketplaceConfig, Error>;
//#endregion
export { useConfig, useConnectorMetadata, useMarketplaceConfig };
//# sourceMappingURL=index-CW2rwwCd.d.ts.map