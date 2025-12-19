import { Qt as OrderbookKind, l as Currency } from "../../../../../../index2.js";
import { C as Price } from "../../../../../../create-config.js";
import "../../../../../../xstate-store.cjs.js";
import "../../../../../../index3.js";
import { Address } from "viem";
import * as react_jsx_runtime9 from "react/jsx-runtime";

//#region src/react/ui/modals/_internal/components/priceInput/index.d.ts
type PriceInputProps = {
  collectionAddress: Address;
  chainId: number;
  secondCurrencyAsDefault?: boolean;
  price: Price | undefined;
  includeNativeCurrency?: boolean;
  onPriceChange?: (price: Price) => void;
  onCurrencyChange?: (currency: Currency) => void;
  checkBalance?: {
    enabled: boolean;
    callback: (state: boolean) => void;
  };
  disabled?: boolean;
  orderbookKind?: OrderbookKind;
  setOpenseaLowestPriceCriteriaMet?: (state: boolean) => void;
  modalType?: 'listing' | 'offer';
  feeData?: {
    royaltyPercentage?: number;
  };
};
declare function PriceInput({
  chainId,
  collectionAddress,
  price,
  onPriceChange,
  onCurrencyChange,
  checkBalance,
  secondCurrencyAsDefault,
  includeNativeCurrency,
  disabled,
  orderbookKind,
  setOpenseaLowestPriceCriteriaMet,
  modalType,
  feeData
}: PriceInputProps): react_jsx_runtime9.JSX.Element;
//#endregion
export { PriceInput as default };
//# sourceMappingURL=index.d.ts.map