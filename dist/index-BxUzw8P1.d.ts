import { MarketplaceConfig, MarketplaceSdkContext$1 as MarketplaceSdkContext, WalletKind } from "./create-config-rrEYvm6u.js";
import * as _tanstack_react_query317 from "@tanstack/react-query";

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
declare const useMarketplaceConfig: () => _tanstack_react_query317.UseQueryResult<MarketplaceConfig, Error>;
//#endregion
export { useConfig as useConfig$1, useConnectorMetadata as useConnectorMetadata$1, useMarketplaceConfig as useMarketplaceConfig$1 };
//# sourceMappingURL=index-BxUzw8P1.d.ts.map