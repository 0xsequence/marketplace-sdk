import { Ft as Address$1, l as Currency, un as OrderbookKind } from "../../../../../../index2.js";
import "../../../../../../create-config.js";
import "../../../../../../xstate-store.cjs.js";
import "../../../../../../index3.js";
import * as react_jsx_runtime7 from "react/jsx-runtime";

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
}: CurrencyOptionsSelectProps): react_jsx_runtime7.JSX.Element;
//#endregion
export { CurrencyOptionsSelect as default };
//# sourceMappingURL=index.d.ts.map