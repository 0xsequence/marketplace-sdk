import { LookupMarketplaceReturn, MarketplaceConfig, SdkConfig } from "./new-marketplace-types-Cggo50UM.js";
import * as _tanstack_react_query422 from "@tanstack/react-query";

//#region src/react/queries/marketplaceConfig.d.ts
declare const fetchMarketplaceConfig: ({
  config,
  prefetchedMarketplaceSettings
}: {
  config: SdkConfig;
  prefetchedMarketplaceSettings?: LookupMarketplaceReturn;
}) => Promise<MarketplaceConfig>;
declare const marketplaceConfigOptions: (config: SdkConfig) => _tanstack_react_query422.OmitKeyof<_tanstack_react_query422.UseQueryOptions<MarketplaceConfig, Error, MarketplaceConfig, ("marketplace" | "configs")[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query422.QueryFunction<MarketplaceConfig, ("marketplace" | "configs")[], never> | undefined;
} & {
  queryKey: ("marketplace" | "configs")[] & {
    [dataTagSymbol]: MarketplaceConfig;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { fetchMarketplaceConfig, marketplaceConfigOptions };
//# sourceMappingURL=index-BJX84qr6.d.ts.map