import { CheckoutOptionsItem, MarketplaceKind, MarketplaceType, Order, OrderbookKind, Step, TokenMetadata } from "./new-marketplace-types-Cggo50UM.js";
import { CollectionType } from "./index-BA8xVqOy.js";
import { ComponentType, ReactNode } from "react";
import { IconProps } from "@0xsequence/design-system";
import * as react_jsx_runtime214 from "react/jsx-runtime";
import { Address, Hash } from "viem";
import "@xstate/store";
import "@legendapp/state";

//#region src/react/ui/components/media/types.d.ts
type MediaProps = {
  name?: string;
  assets: (string | undefined)[];
  assetSrcPrefixUrl?: string;
  className?: string;
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
  isLoading,
  fallbackContent,
  shouldListenForLoad
}: MediaProps): react_jsx_runtime214.JSX.Element;
//#endregion
//#region src/react/ui/modals/_internal/types.d.ts
type ModalCallbacks = {
  onSuccess?: ({
    hash,
    orderId
  }: {
    hash?: Hash;
    orderId?: string;
  }) => void;
  onError?: (error: Error) => void;
  onBuyAtFloorPrice?: () => void;
};
//#endregion
//#region src/react/ui/modals/BuyModal/store.d.ts
type PaymentModalProps = {
  collectibleId: string;
  marketplace: MarketplaceKind;
  orderId: string;
  customCreditCardProviderCallback?: (buyStep: Step) => void;
};
type BuyModalBaseProps = {
  chainId: number;
  collectionAddress: Address;
  skipNativeBalanceCheck?: boolean;
  nativeTokenAddress?: Address;
  marketplaceType?: MarketplaceType;
  customCreditCardProviderCallback?: PaymentModalProps['customCreditCardProviderCallback'];
};
type ShopBuyModalProps = BuyModalBaseProps & {
  marketplaceType: 'shop';
  salesContractAddress: Address;
  items: Array<Partial<CheckoutOptionsItem> & {
    tokenId?: string;
  }>;
  quantityDecimals: number;
  quantityRemaining: number;
  salePrice: {
    amount: string;
    currencyAddress: Address;
  };
  unlimitedSupply?: boolean;
};
type MarketplaceBuyModalProps = BuyModalBaseProps & {
  marketplaceType?: 'market';
  collectibleId: string;
  marketplace: MarketplaceKind;
  orderId: string;
};
type BuyModalProps = ShopBuyModalProps | MarketplaceBuyModalProps;
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
declare const ModalProvider: () => react_jsx_runtime214.JSX.Element;
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
//# sourceMappingURL=index-DLZo9ZA6.d.ts.map