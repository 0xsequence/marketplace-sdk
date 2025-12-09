import { J as ContractType, Mt as Order, X as Currency, _r as OrderbookKind, v as CardType, y as CollectibleCardAction } from "./create-config.js";
import { t as CardClassNames } from "./types.js";
import { u as CollectibleMetadata } from "./index32.js";
import { ReactNode } from "react";
import * as react_jsx_runtime55 from "react/jsx-runtime";
import { Address } from "viem";

//#region src/react/providers/modal-provider.d.ts
interface ModalProviderProps {
  children?: ReactNode;
}
declare const ModalProvider: ({
  children
}: ModalProviderProps) => react_jsx_runtime55.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/MarketCardPresentation.d.ts
interface MarketCardPresentationProps {
  /** Token identification */
  tokenId: bigint;
  chainId: number;
  collectionAddress: Address;
  collectionType: ContractType;
  /** Display data */
  collectibleMetadata: CollectibleMetadata;
  currency?: Currency;
  lowestListing?: Order;
  highestOffer?: Order;
  balance?: string;
  /** Asset configuration */
  assetSrcPrefixUrl?: string;
  /** Interaction handlers */
  onCollectibleClick?: (tokenId: bigint) => void;
  onOfferClick?: (params: {
    order: Order;
    e: React.MouseEvent<HTMLButtonElement>;
  }) => void;
  /** Action button configuration */
  orderbookKind?: OrderbookKind;
  action: CollectibleCardAction;
  showActionButton?: boolean;
  onCannotPerformAction?: (action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER) => void;
  prioritizeOwnerActions?: boolean;
  hideQuantitySelector?: boolean;
  classNames?: CardClassNames;
}
/**
 * MarketCardPresentation - Pure presentation component for market cards
 *
 * This is a "dumb" component that receives all data as props and handles no data fetching.
 * Use this when you want full control over data fetching, or for SSR/SSG scenarios.
 *
 * For a convenient "smart" component with built-in data fetching, use MarketCard instead.
 *
 * @example
 * ```tsx
 * // With pre-fetched data
 * <MarketCardPresentation
 *   tokenId="123"
 *   chainId={1}
 *   collectibleMetadata={metadata}
 *   currency={currency}
 *   lowestListing={listing}
 * />
 * ```
 */
declare function MarketCardPresentation({
  tokenId,
  chainId,
  collectionAddress,
  collectionType,
  collectibleMetadata,
  currency,
  lowestListing,
  highestOffer,
  balance,
  assetSrcPrefixUrl,
  onCollectibleClick,
  onOfferClick,
  orderbookKind,
  action,
  showActionButton,
  onCannotPerformAction,
  prioritizeOwnerActions,
  hideQuantitySelector,
  classNames
}: MarketCardPresentationProps): react_jsx_runtime55.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/ShopCardPresentation.d.ts
interface ShopCardPresentationProps {
  /** Token identification */
  tokenId: bigint;
  chainId: number;
  collectionAddress: Address;
  collectionType: ContractType;
  /** Display data */
  tokenMetadata: CollectibleMetadata;
  saleCurrency?: Currency;
  /** Sale information */
  salePrice?: {
    amount: bigint;
    currencyAddress: Address;
  };
  /** Asset configuration */
  assetSrcPrefixUrl?: string;
  /** Shop card state */
  shopState: {
    mediaClassName?: string;
    titleClassName?: string;
    showActionButton: boolean;
  };
  /** Action button configuration */
  cardType: CardType;
  salesContractAddress?: Address;
  quantityRemaining?: bigint;
  unlimitedSupply?: boolean;
  hideQuantitySelector?: boolean;
  classNames?: CardClassNames;
}
/**
 * ShopCardPresentation - Pure presentation component for shop/primary sale cards
 *
 * This is a "dumb" component that receives all data as props and handles no data fetching.
 * Use this when you want full control over data fetching, or for SSR/SSG scenarios.
 *
 * For a convenient "smart" component with built-in data fetching, use ShopCard instead.
 *
 * @example
 * ```tsx
 * // With pre-fetched data
 * <ShopCardPresentation
 *   tokenId="123"
 *   chainId={1}
 *   tokenMetadata={metadata}
 *   saleCurrency={currency}
 *   shopState={shopState}
 * />
 * ```
 */
declare function ShopCardPresentation({
  tokenId,
  chainId,
  collectionAddress,
  collectionType,
  tokenMetadata,
  saleCurrency,
  salePrice,
  assetSrcPrefixUrl,
  shopState,
  cardType,
  salesContractAddress,
  quantityRemaining,
  unlimitedSupply,
  hideQuantitySelector,
  classNames
}: ShopCardPresentationProps): react_jsx_runtime55.JSX.Element;
//#endregion
//#region src/react/ui/components/media/types.d.ts
type MediaProps = {
  name?: string;
  assets: (string | undefined)[];
  assetSrcPrefixUrl?: string;
  /**
   * @deprecated Use containerClassName instead
   */
  className?: string;
  containerClassName?: string;
  mediaClassname?: string;
  isLoading?: boolean;
  fallbackContent?: ReactNode;
  shouldListenForLoad?: boolean;
};
//#endregion
//#region src/react/ui/components/media/Media.d.ts
/**
 * @description This component is used to display a collectible asset.
 * It will display the first valid asset from the assets array.
 * If no valid asset is found, it will display the fallback content or the default placeholder image.
 *
 * @example
 * <Media
 *  name="Collectible"
 *  assets={[undefined, "some-image-url", undefined]} // undefined assets will be ignored, "some-image-url" will be rendered
 *  assetSrcPrefixUrl="https://example.com/"
 *  className="w-full h-full"
 *  fallbackContent={<YourCustomFallbackComponent />} // Optional custom fallback content
 * />
 */
declare function Media({
  name,
  assets,
  assetSrcPrefixUrl,
  className,
  containerClassName,
  mediaClassname,
  isLoading,
  fallbackContent,
  shouldListenForLoad
}: MediaProps): react_jsx_runtime55.JSX.Element;
//#endregion
export { MarketCardPresentationProps as a, MarketCardPresentation as i, ShopCardPresentation as n, ModalProvider as o, ShopCardPresentationProps as r, Media as t };
//# sourceMappingURL=index30.d.ts.map