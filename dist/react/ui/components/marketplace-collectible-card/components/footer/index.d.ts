import { CardType, ContractType, Currency, Order } from "../../../../../../create-config-DcoJTklJ.js";
import { FooterName, PriceDisplay, SaleDetailsPill, TokenTypeBalancePill, formatPrice } from "../../../../../../index-Das_E6GP.js";
import * as react_jsx_runtime22 from "react/jsx-runtime";
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
}: FooterProps) => react_jsx_runtime22.JSX.Element;
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
}) => react_jsx_runtime22.JSX.Element;
//#endregion
export { Footer, FooterName, NonTradableInventoryFooter, PriceDisplay, SaleDetailsPill, TokenTypeBalancePill, formatPrice };
//# sourceMappingURL=index.d.ts.map