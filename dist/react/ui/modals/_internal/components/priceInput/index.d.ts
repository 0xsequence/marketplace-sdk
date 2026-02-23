import { Ft as Address$1, l as Currency, un as OrderbookKind } from "../../../../../../index2.js";
import { _ as Price } from "../../../../../../create-config.js";
import "../../../../../../xstate-store.cjs.js";
import "../../../../../../index3.js";
import * as react_jsx_runtime11 from "react/jsx-runtime";

//#region src/react/ui/modals/_internal/components/priceInput/index.d.ts
type PriceInputProps = {
  collectionAddress: Address$1;
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
  modalType,
  feeData
}: PriceInputProps): react_jsx_runtime11.JSX.Element;
//#endregion
export { PriceInput as default };
//# sourceMappingURL=index.d.ts.map