import { MarketplaceConfig, MarketplaceSdkContext, WalletKind } from "./create-config-CpiC1m8h.js";
import * as _tanstack_react_query53 from "@tanstack/react-query";

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
declare const useMarketplaceConfig: () => _tanstack_react_query53.UseQueryResult<MarketplaceConfig, Error>;
//#endregion
export { useConfig, useConnectorMetadata, useMarketplaceConfig };
//# sourceMappingURL=index-BgV0aKqw.d.ts.map