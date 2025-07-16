import { BuyModalProps, CollectionType, Order, OrderbookKind, TokenMetadata } from "./create-config-Dvk7oqY1.js";
import { ModalCallbacks } from "./types-BYMSlTl8.js";
import { ComponentType, ReactNode } from "react";
import { IconProps } from "@0xsequence/design-system";
import * as react_jsx_runtime11 from "react/jsx-runtime";
import { Address } from "viem";
import "@legendapp/state";
import "@xstate/store";

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
}: MediaProps): react_jsx_runtime11.JSX.Element;
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
//#region src/react/ui/modals/modal-provider.d.ts
declare const ModalProvider: () => react_jsx_runtime11.JSX.Element;
//#endregion
//#region src/react/ui/modals/SellModal/store.d.ts
type OpenSellModalArgs = {
  collectionAddress: Address;
  chainId: number;
  tokenId: string;
  order: Order;
  callbacks?: ModalCallbacks;
};
//#endregion
//#region src/react/ui/modals/SellModal/index.d.ts
type ShowSellModalArgs = Exclude<OpenSellModalArgs, 'callbacks'>;
declare const useSellModal: (callbacks?: ModalCallbacks) => {
  show: (args: ShowSellModalArgs) => void;
  close: () => void;
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
export { Media, ModalProvider, useBuyModal, useCreateListingModal, useMakeOfferModal, useSellModal, useSuccessfulPurchaseModal, useTransferModal };
//# sourceMappingURL=index-YuPuwYP5.d.ts.map