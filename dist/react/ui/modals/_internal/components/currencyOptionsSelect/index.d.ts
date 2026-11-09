import { It as Address$1, dn as OrderbookKind, u as Currency } from "../../../../../../index2.js";
import "../../../../../../create-config.js";
import "../../../../../../xstate-store.cjs.js";
import "../../../../../../index3.js";
import * as react_jsx_runtime5 from "react/jsx-runtime";

//#region src/react/ui/modals/_internal/components/currencyOptionsSelect/index.d.ts
type CurrencyOptionsSelectProps = {
  collectionAddress: Address$1;
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