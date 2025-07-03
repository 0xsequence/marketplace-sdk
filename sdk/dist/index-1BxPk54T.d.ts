import { CheckoutOptionsItem, MarketplaceKind, MarketplaceType, OrderbookKind, Step } from "./new-marketplace-types-Cggo50UM.js";
import { Address, Hash } from "viem";
import "@xstate/store";
import { Databeat, Event } from "@databeat/tracker";

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
//#region src/react/_internal/databeat/types.d.ts
declare enum EventType {
  BUY_ITEMS = 0,
  SELL_ITEMS = 1,
  CREATE_LISTING = 2,
  CREATE_OFFER = 3,
  CANCEL_LISTING = 4,
  CANCEL_OFFER = 5,
  TRANSACTION_FAILED = 6,
  BUY_MODAL_OPENED = 7,
}
interface PropsEvent {
  [key: string]: string;
}
interface NumsEvent {
  [key: string]: number;
}
interface Transaction extends PropsEvent {
  chainId: string;
  txnHash: string;
}
interface TradeItemsInfo extends PropsEvent {
  marketplaceKind: MarketplaceKind;
  userId: string;
  collectionAddress: string;
  currencyAddress: string;
  currencySymbol: string;
}
interface TradeItemsValues extends NumsEvent {
  currencyValueDecimal: number;
  currencyValueRaw: number;
}
type BuyModalOpenedProps = Omit<BuyModalProps, 'marketplaceType' | 'customCreditCardProviderCallback' | 'chainId' | 'skipNativeBalanceCheck' | 'nativeTokenAddress'> & {
  buyAnalyticsId: string;
};
type BuyModalOpenedNums = {
  chainId: number;
};
interface TrackBuyModalOpened {
  props: BuyModalOpenedProps;
  nums: BuyModalOpenedNums;
}
interface TrackSellItems {
  props: TradeItemsInfo & Transaction;
  nums: TradeItemsValues;
}
interface ListOfferItemsInfo extends PropsEvent {
  orderbookKind: OrderbookKind;
  collectionAddress: string;
  currencyAddress: string;
  currencySymbol: string;
}
interface ListOfferItemsValues extends NumsEvent {
  currencyValueDecimal: number;
  currencyValueRaw: number;
}
interface TrackCreateListing {
  props: ListOfferItemsInfo & Transaction;
  nums: ListOfferItemsValues;
}
interface TrackCreateOffer {
  props: ListOfferItemsInfo & Transaction;
  nums: ListOfferItemsValues;
}
interface TrackTransactionFailed extends Transaction, PropsEvent {}
//#endregion
//#region src/react/_internal/databeat/index.d.ts
type EventTypes = keyof typeof EventType;
type Event$1 = Event<EventTypes>;
declare class DatabeatAnalytics extends Databeat<Extract<EventTypes, string>> {
  trackSellItems(args: TrackSellItems): void;
  trackBuyModalOpened(args: TrackBuyModalOpened): void;
  trackCreateListing(args: TrackCreateListing): void;
  trackCreateOffer(args: TrackCreateOffer): void;
  trackTransactionFailed(args: TrackTransactionFailed): void;
}
declare const useAnalytics: () => DatabeatAnalytics;
//#endregion
export { BuyModalProps, DatabeatAnalytics, Event$1 as Event, EventTypes, useAnalytics };
//# sourceMappingURL=index-1BxPk54T.d.ts.map