import { CardType, ContractType, Currency, Order } from "../../../../../../create-config-BpPJGqAC.js";
import { FooterName$1 as FooterName, PriceDisplay$1 as PriceDisplay, SaleDetailsPill$1 as SaleDetailsPill, TokenTypeBalancePill$1 as TokenTypeBalancePill, formatPrice$3 as formatPrice } from "../../../../../../index-3fppJyrg.js";
import * as react_jsx_runtime6 from "react/jsx-runtime";
import { Address } from "viem";

//#region src/react/ui/components/marketplace-collectible-card/components/footer/Footer.d.ts
type FooterProps = {
  chainId: number;
  collectionAddress: Address;
  collectibleId: string;
  name: string;
  type?: ContractType;
  decimals?: number;
  onOfferClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  highestOffer?: Order;
  balance?: string;
  quantityInitial?: string | undefined;
  quantityRemaining?: string | undefined;
  unlimitedSupply?: boolean;
  cardType: CardType;
  salePriceAmount?: string;
  salePriceCurrency?: Currency;
};
declare const Footer: ({
  chainId,
  collectionAddress,
  collectibleId,
  name,
  type,
  decimals,
  onOfferClick,
  highestOffer,
  balance,
  quantityInitial,
  quantityRemaining,
  unlimitedSupply,
  cardType,
  salePriceAmount,
  salePriceCurrency
}: FooterProps) => react_jsx_runtime6.JSX.Element;
declare const NonTradableInventoryFooter: ({
  name,
  balance,
  decimals,
  type
}: {
  name: string;
  balance?: string;
  decimals?: number;
  type: ContractType;
}) => react_jsx_runtime6.JSX.Element;
//#endregion
export { Footer, FooterName, NonTradableInventoryFooter, PriceDisplay, SaleDetailsPill, TokenTypeBalancePill, formatPrice };
//# sourceMappingURL=index.d.ts.map