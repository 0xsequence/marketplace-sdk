import { Lt as OrderbookKind, X as Currency } from "../../../../../../create-config.js";
import "../../../../../../types.js";
import * as react_jsx_runtime5 from "react/jsx-runtime";
import { Address } from "viem";

//#region src/react/ui/modals/_internal/components/currencyOptionsSelect/index.d.ts
type CurrencyOptionsSelectProps = {
  collectionAddress: Address;
  chainId: number;
  selectedCurrency?: Currency | null;
  onCurrencyChange: (currency: Currency) => void;
  secondCurrencyAsDefault?: boolean;
  includeNativeCurrency?: boolean;
  orderbookKind?: OrderbookKind;
  modalType?: 'listing' | 'offer';
};
declare function CurrencyOptionsSelect({
  chainId,
  collectionAddress,
  secondCurrencyAsDefault,
  selectedCurrency,
  onCurrencyChange,
  includeNativeCurrency,
  orderbookKind,
  modalType
}: CurrencyOptionsSelectProps): react_jsx_runtime5.JSX.Element;
//#endregion
export { CurrencyOptionsSelect as default };
//# sourceMappingURL=index.d.ts.map