import type { MarketplaceKind, OrderbookKind } from '../api';

export enum EventType {
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
	chainId: number;
	txnHash: string;
}

interface TradeItemsInfo extends PropsEvent {
	marketplaceKind: MarketplaceKind;
	collectionAddress: string;
	currencyAddress: string;
	currencySymbol: string;
}

interface TradeItemsValues extends NumsEvent {
	currencyValueDecimal: number;
	currencyValueRaw: number;
}

export interface TrackBuyItems {
	props: TradeItemsInfo & Transaction;
	nums: TradeItemsValues;
}

export interface TrackSellItems {
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

export interface TrackCreateListing {
	props: ListOfferItemsInfo & Transaction;
	nums: ListOfferItemsValues;
}

export interface TrackCreateOffer {
	props: ListOfferItemsInfo & Transaction;
	nums: ListOfferItemsValues;
}

export interface TrackTransactionFailed extends Transaction, PropsEvent {}
