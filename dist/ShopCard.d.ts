import { i as MarketCollectibleCardProps, l as ShopCollectibleCardProps, n as CollectibleCardProps } from "./types.js";
import * as react_jsx_runtime52 from "react/jsx-runtime";

//#region src/react/ui/components/marketplace-collectible-card/CollectibleCard.d.ts
declare function CollectibleCard(props: CollectibleCardProps): react_jsx_runtime52.JSX.Element | undefined;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/MarketCard.d.ts
/**
 * MarketCard - Smart component with built-in data fetching
 *
 * This component handles currency fetching and action determination automatically.
 * Use this for convenient plug-and-play integration.
 *
 * For full control over data fetching (e.g., SSR/SSG), use MarketCardPresentation instead.
 *
 * @example
 * ```tsx
 * <MarketCard
 *   tokenId="123"
 *   chainId={1}
 *   collectionAddress="0x..."
 *   collectible={collectible}
 * />
 * ```
 */
declare function MarketCard({
  tokenId,
  chainId,
  collectionAddress,
  collectionType,
  assetSrcPrefixUrl,
  cardLoading,
  orderbookKind,
  collectible,
  onCollectibleClick,
  onOfferClick,
  balance,
  balanceIsLoading,
  onCannotPerformAction,
  prioritizeOwnerActions,
  hideQuantitySelector,
  classNames
}: MarketCollectibleCardProps): react_jsx_runtime52.JSX.Element | null;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/ShopCard.d.ts
/**
 * ShopCard - Smart component with built-in data fetching
 *
 * This component handles currency fetching and shop state calculation automatically.
 * Use this for convenient plug-and-play integration.
 *
 * For full control over data fetching (e.g., SSR/SSG), use ShopCardPresentation instead.
 *
 * @example
 * ```tsx
 * <ShopCard
 *   tokenId="123"
 *   chainId={1}
 *   collectionAddress="0x..."
 *   tokenMetadata={metadata}
 *   salePrice={salePrice}
 * />
 * ```
 */
declare function ShopCard({
  tokenId,
  chainId,
  collectionAddress,
  collectionType,
  assetSrcPrefixUrl,
  cardLoading,
  cardType,
  salesContractAddress,
  tokenMetadata,
  salePrice,
  quantityInitial,
  quantityRemaining,
  unlimitedSupply,
  hideQuantitySelector,
  classNames
}: ShopCollectibleCardProps): react_jsx_runtime52.JSX.Element | null;
//#endregion
export { MarketCard as n, CollectibleCard as r, ShopCard as t };
//# sourceMappingURL=ShopCard.d.ts.map