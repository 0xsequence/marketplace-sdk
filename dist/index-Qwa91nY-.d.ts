import { MarketplaceConfig, MarketplaceSdkContext, WalletKind } from "./create-config-CuwJHf1v.js";
import * as _tanstack_react_query18 from "@tanstack/react-query";

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
declare const useMarketplaceConfig: () => _tanstack_react_query18.UseQueryResult<MarketplaceConfig, Error>;
//#endregion
export { useConfig, useConnectorMetadata, useMarketplaceConfig };
//# sourceMappingURL=index-Qwa91nY-.d.ts.map