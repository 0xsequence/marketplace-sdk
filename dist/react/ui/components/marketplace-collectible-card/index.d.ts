import { xn as TokenMetadata } from "../../../../index2.js";
import "../../../../create-config.js";
import "../../../../xstate-store.cjs.js";
import "../../../../index3.js";
import "../../../../index4.js";
import "../../../../index8.js";
import "../../../../index9.js";
import "../../../../index13.js";
import { a as MarketplaceCardBaseProps, c as ShopCardSpecificProps, i as MarketCollectibleCardProps, l as ShopCollectibleCardProps, n as CollectibleCardProps, o as MarketplaceCollectibleCardProps, r as MarketCardSpecificProps, s as NonTradableInventoryCardProps, t as CardClassNames } from "../../../../types.js";
import { t as ActionButton } from "../../../../index33.js";
import { a as CardBadgeProps, c as CardContentProps, d as CardProps, i as CardFooterProps, l as CardMediaProps, n as CardSkeletonProps, o as CardPriceProps, r as CardSaleDetailsProps, s as CardTitleProps, t as Card } from "../../../../index34.js";
import { n as MarketCard, r as CollectibleCard, t as ShopCard } from "../../../../ShopCard.js";
import { a as renderSkeletonIfLoading, c as UNDERFLOW_PRICE, d as DetermineCardActionParams, f as determineCardAction, i as getShopCardState, l as formatPriceData, n as ShopCardState, o as FormattedPrice, r as ShopCardStateParams, s as OVERFLOW_PRICE, t as getSupplyStatusText, u as formatPriceNumber } from "../../../../index35.js";
import * as react31 from "react";

//#region src/react/ui/components/marketplace-collectible-card/constants.d.ts
/**
 * Constants used across card components
 */
/**
 * Default maximum length for card titles
 */
declare const CARD_TITLE_MAX_LENGTH_DEFAULT = 17;
/**
 * Maximum length for card titles when an offer bell is displayed
 * Reduced to reserve space for the offer notification icon
 */
declare const CARD_TITLE_MAX_LENGTH_WITH_OFFER = 15;
/**
 * Number of characters reserved for the offer bell icon in the title
 * Used internally by Card.Title for truncation calculations
 */
declare const OFFER_BELL_RESERVED_CHARS = 2;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/NonTradableInventoryCard.d.ts
declare const NonTradableInventoryCard: react31.ForwardRefExoticComponent<MarketplaceCardBaseProps & {
  balance: string;
  balanceIsLoading: boolean;
  collectibleMetadata: Pick<TokenMetadata, "name" | "image" | "video" | "animation_url">;
} & {
  cardType?: "inventory-non-tradable";
} & react31.RefAttributes<HTMLDivElement>>;
//#endregion
export { ActionButton, CARD_TITLE_MAX_LENGTH_DEFAULT, CARD_TITLE_MAX_LENGTH_WITH_OFFER, Card, CardBadgeProps, CardClassNames, CardContentProps, CardFooterProps, CardMediaProps, CardPriceProps, CardProps, CardSaleDetailsProps, CardSkeletonProps, CardTitleProps, CollectibleCard, CollectibleCardProps, DetermineCardActionParams, FormattedPrice, MarketCard, MarketCardSpecificProps, MarketCollectibleCardProps, MarketplaceCardBaseProps, MarketplaceCollectibleCardProps, NonTradableInventoryCard, NonTradableInventoryCardProps, OFFER_BELL_RESERVED_CHARS, OVERFLOW_PRICE, ShopCard, ShopCardSpecificProps, ShopCardState, ShopCardStateParams, ShopCollectibleCardProps, UNDERFLOW_PRICE, determineCardAction, formatPriceData, formatPriceNumber, getShopCardState, getSupplyStatusText, renderSkeletonIfLoading };
//# sourceMappingURL=index.d.ts.map