import { Gt as ContractType, si as Order, tn as Currency } from "./create-config-Cws5O44a.js";
import * as react_jsx_runtime26 from "react/jsx-runtime";

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
}: FooterNameProps) => react_jsx_runtime26.JSX.Element;
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
}: PriceDisplayProps) => react_jsx_runtime26.JSX.Element;
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
}: SaleDetailsPillProps) => react_jsx_runtime26.JSX.Element;
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
}: TokenTypeBalancePillProps) => react_jsx_runtime26.JSX.Element;
//#endregion
export { FooterName as a, formatPrice as i, SaleDetailsPill as n, PriceDisplay as r, TokenTypeBalancePill as t };
//# sourceMappingURL=index-CvSdPF4o.d.ts.map