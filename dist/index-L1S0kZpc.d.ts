import { At as ContractType, Bt as Currency, K as CardType, Pi as TokenMetadata, Yr as Order, ei as OrderbookKind, nt as ModalCallbacks, q as CollectibleCardAction, tt as BuyModalProps, x as CollectionType } from "./create-config-BO68TZC5.js";
import { t as CardClassNames } from "./types-B9D2v5PF.js";
import { u as CollectibleMetadata } from "./index-3igQuDvc.js";
import { ComponentType, ReactNode } from "react";
import { IconProps } from "@0xsequence/design-system";
import * as react_jsx_runtime29 from "react/jsx-runtime";
import { Address } from "viem";
import "@xstate/store";
import "@legendapp/state";

//#region src/react/providers/modal-provider.d.ts
interface ModalProviderProps {
  children?: ReactNode;
}
declare const ModalProvider: ({
  children
}: ModalProviderProps) => react_jsx_runtime29.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/MarketCardPresentation.d.ts
interface MarketCardPresentationProps {
  /** Token identification */
  tokenId: string;
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
  onCollectibleClick?: (tokenId: string) => void;
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
}: MarketCardPresentationProps): react_jsx_runtime29.JSX.Element;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/variants/ShopCardPresentation.d.ts
interface ShopCardPresentationProps {
  /** Token identification */
  tokenId: string;
  chainId: number;
  collectionAddress: Address;
  collectionType: ContractType;
  /** Display data */
  tokenMetadata: CollectibleMetadata;
  saleCurrency?: Currency;
  /** Sale information */
  salePrice?: {
    amount: string;
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
  quantityDecimals?: number;
  quantityRemaining?: number;
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
  quantityDecimals,
  quantityRemaining,
  unlimitedSupply,
  hideQuantitySelector,
  classNames
}: ShopCardPresentationProps): react_jsx_runtime29.JSX.Element;
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
}: MediaProps): react_jsx_runtime29.JSX.Element;
//#endregion
//#region src/react/ui/modals/BuyModal/index.d.ts
declare const useBuyModal: (callbacks?: ModalCallbacks) => {
  show: (args: BuyModalProps) => void;
  close: () => void;
};
//#endregion
//#region src/react/ui/modals/CreateListingModal/store.d.ts
type OpenCreateListingModalArgs = {
  collectionAddress: Address;
  chainId: number;
  collectibleId: string;
  orderbookKind?: OrderbookKind;
  callbacks?: ModalCallbacks;
};
//#endregion
//#region src/react/ui/modals/CreateListingModal/index.d.ts
type ShowCreateListingModalArgs = Exclude<OpenCreateListingModalArgs, 'callbacks'>;
declare const useCreateListingModal: (callbacks?: ModalCallbacks) => {
  show: (args: ShowCreateListingModalArgs) => void;
  close: () => void;
};
//#endregion
//#region src/react/ui/modals/MakeOfferModal/store.d.ts
type OpenMakeOfferModalArgs = {
  collectionAddress: Address;
  chainId: number;
  collectibleId: string;
  orderbookKind?: OrderbookKind;
  callbacks?: ModalCallbacks;
};
//#endregion
//#region src/react/ui/modals/MakeOfferModal/index.d.ts
type ShowMakeOfferModalArgs = Exclude<OpenMakeOfferModalArgs, 'callbacks'>;
declare const useMakeOfferModal: (callbacks?: ModalCallbacks) => {
  show: (args: ShowMakeOfferModalArgs) => void;
  close: () => void;
};
//#endregion
//#region src/react/ui/modals/SellModal/internal/store.d.ts
type OpenSellModalArgs = {
  collectionAddress: Address;
  chainId: number;
  tokenId: string;
  order: Order;
  callbacks?: ModalCallbacks;
};
declare const useSellModal: () => {
  show: (args: OpenSellModalArgs) => void;
  close: () => void;
  tokenId: string;
  chainId: number;
  collectionAddress: Address;
  callbacks?: ModalCallbacks | undefined;
  isOpen: boolean;
  order: Order | null;
};
//#endregion
//#region src/react/ui/modals/SuccessfulPurchaseModal/store.d.ts
interface SuccessfulPurchaseModalState {
  isOpen: boolean;
  state: {
    collectibles: TokenMetadata[];
    totalPrice: string;
    explorerName: string;
    explorerUrl: string;
    ctaOptions?: {
      ctaLabel: string;
      ctaOnClick: () => void;
      ctaIcon?: ComponentType<IconProps>;
    };
  };
  callbacks?: ModalCallbacks;
}
//#endregion
//#region src/react/ui/modals/SuccessfulPurchaseModal/index.d.ts
declare const useSuccessfulPurchaseModal: (callbacks?: ModalCallbacks) => {
  show: (args: SuccessfulPurchaseModalState["state"]) => void;
  close: () => void;
};
//#endregion
//#region src/react/ui/modals/TransferModal/index.d.ts
type ShowTransferModalArgs = {
  collectionAddress: Address;
  collectibleId: string;
  chainId: number;
  collectionType?: CollectionType;
  callbacks?: ModalCallbacks;
};
declare const useTransferModal: () => {
  show: (args: ShowTransferModalArgs) => void;
  close: () => void;
};
//#endregion
export { useCreateListingModal as a, ShopCardPresentation as c, MarketCardPresentationProps as d, ModalProvider as f, useMakeOfferModal as i, ShopCardPresentationProps as l, useSuccessfulPurchaseModal as n, useBuyModal as o, useSellModal as r, Media as s, useTransferModal as t, MarketCardPresentation as u };
//# sourceMappingURL=index-L1S0kZpc.d.ts.map