import { ContractType, Currency, Order } from "./create-config-BpPJGqAC.js";
import * as react_jsx_runtime8 from "react/jsx-runtime";
import * as react_jsx_runtime9 from "react/jsx-runtime";
import * as react_jsx_runtime10 from "react/jsx-runtime";
import * as react_jsx_runtime11 from "react/jsx-runtime";

//#region src/react/ui/components/marketplace-collectible-card/components/footer/components/FooterName.d.ts
interface FooterNameProps {
  name: string;
  isShop?: boolean;
  highestOffer?: Order;
  onOfferClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  quantityInitial?: string;
  quantityRemaining?: string;
  balance?: string;
}
declare const FooterName: ({
  name,
  isShop,
  highestOffer,
  onOfferClick,
  quantityInitial,
  quantityRemaining,
  balance
}: FooterNameProps) => react_jsx_runtime8.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/footer/components/PriceDisplay.d.ts
interface PriceDisplayProps {
  amount: string;
  currency: Currency;
  showCurrencyIcon?: boolean;
  className?: string;
}
declare const formatPrice: (amount: string, currency: Currency) => React.ReactNode;
declare const PriceDisplay: ({
  amount,
  currency,
  showCurrencyIcon,
  className
}: PriceDisplayProps) => react_jsx_runtime9.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/footer/components/SaleDetailsPill.d.ts
interface SaleDetailsPillProps {
  quantityRemaining: string | undefined;
  collectionType: ContractType;
  unlimitedSupply?: boolean;
}
declare const SaleDetailsPill: ({
  quantityRemaining,
  collectionType,
  unlimitedSupply
}: SaleDetailsPillProps) => react_jsx_runtime10.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/components/footer/components/TokenTypeBalancePill.d.ts
interface TokenTypeBalancePillProps {
  balance?: string;
  type: ContractType;
  decimals?: number;
}
declare const TokenTypeBalancePill: ({
  balance,
  type,
  decimals
}: TokenTypeBalancePillProps) => react_jsx_runtime11.JSX.Element;
//#endregion
export { FooterName as FooterName$1, PriceDisplay as PriceDisplay$1, SaleDetailsPill as SaleDetailsPill$1, TokenTypeBalancePill as TokenTypeBalancePill$1, formatPrice as formatPrice$3 };
//# sourceMappingURL=index-3fppJyrg.d.ts.map