import { MarketplaceConfig, SdkConfig } from "./new-marketplace-types-Cggo50UM.js";
import * as wagmi1 from "wagmi";
import { Chain, Transport } from "viem";

//#region src/react/_internal/wagmi/create-config.d.ts
declare const createWagmiConfig: (marketplaceConfig: MarketplaceConfig, sdkConfig: SdkConfig, ssr?: boolean) => wagmi1.Config<[Chain, ...Chain[]], Record<number, Transport>, wagmi1.CreateConnectorFn[]>;
declare function getWagmiChainsAndTransports({
  marketplaceConfig,
  sdkConfig
}: {
  marketplaceConfig: MarketplaceConfig;
  sdkConfig: SdkConfig;
}): {
  chains: [Chain, ...Chain[]];
  transports: Record<number, Transport>;
};
//#endregion
export { createWagmiConfig, getWagmiChainsAndTransports };
//# sourceMappingURL=create-config-BgVYLBpS.d.ts.map