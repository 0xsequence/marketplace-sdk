import { MarketplaceConfig, MarketplaceWalletType, SdkConfig } from "./new-marketplace-types-Cggo50UM.js";
import { Wallet } from "@0xsequence/connect";
import { CreateConnectorFn } from "wagmi";

//#region src/react/_internal/wagmi/get-connectors.d.ts
declare function getConnectors({
  marketplaceConfig,
  sdkConfig,
  walletType
}: {
  marketplaceConfig: MarketplaceConfig;
  sdkConfig: SdkConfig;
  walletType: MarketplaceWalletType;
}): CreateConnectorFn[];
declare function getWaasConnectors(config: SdkConfig, marketplaceConfig: MarketplaceConfig): Wallet[];
declare function getEcosystemConnector(marketplaceConfig: MarketplaceConfig, sdkConfig: SdkConfig): Wallet;
//#endregion
export { getConnectors, getEcosystemConnector, getWaasConnectors };
//# sourceMappingURL=index-DEYk3AB-.d.ts.map