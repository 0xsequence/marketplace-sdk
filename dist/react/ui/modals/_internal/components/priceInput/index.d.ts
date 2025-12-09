import { k as Price, lr as Currency$1 } from "../../../../../../create-config.js";
import { OrderbookKind } from "@0xsequence/api-client";
import * as react_jsx_runtime10 from "react/jsx-runtime";
import { Address as Address$1 } from "viem";

//#region src/react/ui/modals/_internal/components/priceInput/index.d.ts
type PriceInputProps = {
  collectionAddress: Address$1;
  chainId: number;
  secondCurrencyAsDefault?: boolean;
  price: Price | undefined;
  includeNativeCurrency?: boolean;
  onPriceChange?: (price: Price) => void;
  onCurrencyChange?: (currency: Currency$1) => void;
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
}: PriceInputProps): react_jsx_runtime10.JSX.Element;
//#endregion
export { PriceInput as default };
//# sourceMappingURL=index.d.ts.map