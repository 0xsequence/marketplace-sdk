import { c as SdkConfig, s as MarketplaceSdkContext } from "./create-config.js";
import * as react0 from "react";
import * as react_jsx_runtime0 from "react/jsx-runtime";

//#region src/react/providers/index.d.ts
declare const MarketplaceSdkContext$1: react0.Context<MarketplaceSdkContext | undefined>;
type MarketplaceSdkProviderProps = {
  config: SdkConfig;
  children: React.ReactNode;
  openConnectModal?: () => void;
};
declare function MarketplaceProvider({
  config,
  children,
  openConnectModal
}: MarketplaceSdkProviderProps): react_jsx_runtime0.JSX.Element;
declare function MarketplaceQueryClientProvider({
  children
}: {
  children: React.ReactNode;
}): react_jsx_runtime0.JSX.Element;
//#endregion
export { MarketplaceSdkProviderProps as i, MarketplaceQueryClientProvider as n, MarketplaceSdkContext$1 as r, MarketplaceProvider as t };
//# sourceMappingURL=index24.d.ts.map