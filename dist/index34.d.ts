import { Z as Order, l as Currency, s as ContractType } from "./index2.js";
import { l as CardType } from "./create-config.js";
import * as react0 from "react";
import * as react_jsx_runtime28 from "react/jsx-runtime";

//#region src/react/ui/components/marketplace-collectible-card/Card/card.d.ts
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-media.d.ts
interface CollectibleMetadata {
  name?: string;
  image?: string;
  video?: string;
  animation_url?: string;
  decimals?: number;
}
interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  image?: string;
  video?: string;
  animationUrl?: string;
  metadata?: CollectibleMetadata;
  assetSrcPrefixUrl?: string;
  fallbackContent?: React.ReactNode;
}
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-content.d.ts
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-title.d.ts
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  highestOffer?: Order;
  onOfferClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  balance?: string;
  maxLength?: number;
}
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-price.d.ts
interface CardPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  amount?: bigint;
  currency?: Currency;
  showCurrencyIcon?: boolean;
  type: CardType;
}
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-badge.d.ts
interface CardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  type: ContractType;
  balance?: string;
}
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-footer.d.ts
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
}
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-sale-details.d.ts
interface CardSaleDetailsProps {
  quantityRemaining?: bigint;
  type: ContractType;
  unlimitedSupply?: boolean;
  className?: string;
}
declare function CardSaleDetails({
  quantityRemaining,
  type,
  unlimitedSupply,
  className
}: CardSaleDetailsProps): react_jsx_runtime28.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-skeleton.d.ts
interface CardSkeletonProps {
  type?: ContractType;
  isShop?: boolean;
}
declare function CardSkeleton({
  type,
  isShop
}: CardSkeletonProps): react_jsx_runtime28.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/index.d.ts
declare const Card: react0.ForwardRefExoticComponent<CardProps & react0.RefAttributes<HTMLDivElement>> & {
  Media: react0.ForwardRefExoticComponent<CardMediaProps & react0.RefAttributes<HTMLDivElement>>;
  Content: react0.ForwardRefExoticComponent<CardContentProps & react0.RefAttributes<HTMLDivElement>>;
  Title: react0.ForwardRefExoticComponent<CardTitleProps & react0.RefAttributes<HTMLHeadingElement>>;
  Price: react0.ForwardRefExoticComponent<CardPriceProps & react0.RefAttributes<HTMLDivElement>>;
  Badge: react0.ForwardRefExoticComponent<CardBadgeProps & react0.RefAttributes<HTMLDivElement>>;
  Footer: react0.ForwardRefExoticComponent<CardFooterProps & react0.RefAttributes<HTMLDivElement>>;
  SaleDetails: typeof CardSaleDetails;
  Skeleton: typeof CardSkeleton;
};
//#endregion
export { CardBadgeProps as a, CardContentProps as c, CardProps as d, CardFooterProps as i, CardMediaProps as l, CardSkeletonProps as n, CardPriceProps as o, CardSaleDetailsProps as r, CardTitleProps as s, Card as t, CollectibleMetadata as u };
//# sourceMappingURL=index34.d.ts.map