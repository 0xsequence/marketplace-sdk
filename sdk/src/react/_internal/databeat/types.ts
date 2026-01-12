import type { MarketplaceKind, OrderbookKind } from '@0xsequence/api-client';
import type { BuyModalProps } from '../../ui/modals/BuyModal/store';

export enum EventType {
	BUY_ITEMS = 0,
	SELL_ITEMS = 1,
	CREATE_LISTING = 2,
	CREATE_OFFER = 3,
	CANCEL_LISTING = 4,
	CANCEL_OFFER = 5,
	TRANSACTION_FAILED = 6,
	BUY_MODAL_OPENED = 7,
}

type PropsEvent = Record<string, string>;

type NumsEvent = Record<string, number>;

type Transaction = PropsEvent & {
	chainId: string;
	txnHash: string;
};

type TradeItemsInfo = PropsEvent & {
	marketplaceKind: MarketplaceKind;
	userId: string;
	collectionAddress: string;
	currencyAddress: string;
	currencySymbol: string;
};

type TradeItemsValues = NumsEvent & {
	currencyValueDecimal: number;
	currencyValueRaw: number;
};

export type TrackBuyItems = {
	props: TradeItemsInfo & Transaction;
	nums: TradeItemsValues;
};

type BuyModalOpenedProps = Omit<
	BuyModalProps,
	| 'marketplaceType'
	| 'customCreditCardProviderCallback'
	| 'chainId'
	| 'skipNativeBalanceCheck'
	| 'nativeTokenAddress'
	| 'successActionButtons'
	| 'hideQuantitySelector'
> & {
	buyAnalyticsId: string;
};

type BuyModalOpenedNums = {
	chainId: number;
};

export type TrackBuyModalOpened = {
	props: BuyModalOpenedProps;
	nums: BuyModalOpenedNums;
};

export type TrackSellItems = {
	props: TradeItemsInfo & Transaction;
	nums: TradeItemsValues;
};

type ListOfferItemsInfo = PropsEvent & {
	orderbookKind: OrderbookKind;
	collectionAddress: string;
	currencyAddress: string;
	currencySymbol: string;
};

type ListOfferItemsValues = NumsEvent & {
	currencyValueDecimal: number;
	currencyValueRaw: number;
};

export type TrackCreateListing = {
	props: ListOfferItemsInfo & Transaction;
	nums: ListOfferItemsValues;
};

export type TrackCreateOffer = {
	props: ListOfferItemsInfo & Transaction;
	nums: ListOfferItemsValues;
};

export type TrackTransactionFailed = Transaction & PropsEvent;
