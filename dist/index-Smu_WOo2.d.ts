import { MarketplaceConfig, MarketplaceSdkContext$1 as MarketplaceSdkContext, WalletKind } from "./create-config-CsagtMvq.js";
import * as _tanstack_react_query5 from "@tanstack/react-query";

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
declare const useMarketplaceConfig: () => _tanstack_react_query5.UseQueryResult<MarketplaceConfig, Error>;
//#endregion
export { useConfig as useConfig$1, useConnectorMetadata as useConnectorMetadata$1, useMarketplaceConfig as useMarketplaceConfig$1 };
//# sourceMappingURL=index-Smu_WOo2.d.ts.map