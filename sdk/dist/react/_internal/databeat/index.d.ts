import { MarketplaceKind, OrderbookKind } from "../../../new-marketplace-types-Cggo50UM.js";
import "../../../builder-api-7g5a_lFO.js";
import "../../../index-CMZWWb2s.js";
import { Databeat, Event as Event$1 } from "@databeat/tracker";

//#region src/react/_internal/databeat/types.d.ts
declare enum EventType {
  BUY_ITEMS = 0,
  SELL_ITEMS = 1,
  CREATE_LISTING = 2,
  CREATE_OFFER = 3,
  CANCEL_LISTING = 4,
  CANCEL_OFFER = 5,
  TRANSACTION_FAILED = 6,
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
type Event = Event$1<EventTypes>;
declare class DatabeatAnalytics extends Databeat<Extract<EventTypes, string>> {
  trackSellItems(args: TrackSellItems): void;
  trackCreateListing(args: TrackCreateListing): void;
  trackCreateOffer(args: TrackCreateOffer): void;
  trackTransactionFailed(args: TrackTransactionFailed): void;
}
declare const useAnalytics: () => DatabeatAnalytics;
//#endregion
export { DatabeatAnalytics, Event, EventTypes, useAnalytics };
//# sourceMappingURL=index.d.ts.map