import { ContractType } from "./create-config-tyvmEx4z.js";

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
export { OVERFLOW_PRICE, UNDERFLOW_PRICE, formatPriceNumber, getSupplyStatusText };
//# sourceMappingURL=index-C3RqAE78.d.ts.map