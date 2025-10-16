import { ContractType } from "./create-config-BpPJGqAC.js";

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
export { OVERFLOW_PRICE as OVERFLOW_PRICE$1, UNDERFLOW_PRICE as UNDERFLOW_PRICE$1, formatPriceNumber as formatPriceNumber$1, getSupplyStatusText as getSupplyStatusText$1 };
//# sourceMappingURL=index-synAUE2L.d.ts.map