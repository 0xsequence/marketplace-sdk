import { Vt as ContractType } from "./create-config-Dz-QylqB.js";

//#region src/react/ui/components/marketplace-collectible-card/utils/formatPrice.d.ts
declare const OVERFLOW_PRICE = 100000000;
declare const UNDERFLOW_PRICE = 0.0001;
declare const formatPriceNumber: (amount: string, decimals: number) => {
  formattedNumber: string;
  isUnderflow: boolean;
  isOverflow: boolean;
};
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/supplyStatus.d.ts
declare const getSupplyStatusText: ({
  quantityRemaining,
  collectionType,
  unlimitedSupply
}: {
  quantityRemaining: string | undefined;
  collectionType: ContractType;
  unlimitedSupply?: boolean;
}) => string;
//#endregion
export { formatPriceNumber as i, OVERFLOW_PRICE as n, UNDERFLOW_PRICE as r, getSupplyStatusText as t };
//# sourceMappingURL=index-Dfj8d4Lv.d.ts.map