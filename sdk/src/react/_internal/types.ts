import type {
	ContractType,
	CreateReq,
	MarketplaceKind,
} from '@0xsequence/marketplace-api';

export interface QueryArg {
	enabled?: boolean;
}

export type CollectableId = string | number;

export type CollectionType = ContractType.ERC1155 | ContractType.ERC721;

type TransactionStep = {
	exist: boolean;
	isExecuting: boolean;
	execute: () => Promise<void>;
};

export type TransactionSteps = {
	approval: TransactionStep;
	transaction: TransactionStep;
};

export enum TransactionType {
	BUY = 'BUY',
	SELL = 'SELL',
	LISTING = 'LISTING',
	OFFER = 'OFFER',
	TRANSFER = 'TRANSFER',
	CANCEL = 'CANCEL',
}

export interface BuyInput {
	orderId: string;
	collectableDecimals: number;
	marketplace: MarketplaceKind;
	quantity: string;
}

export interface SellInput {
	orderId: string;
	marketplace: MarketplaceKind;
	quantity?: string;
}

export interface ListingInput {
	contractType: ContractType;
	listing: CreateReq;
}

export interface OfferInput {
	contractType: ContractType;
	offer: CreateReq;
}

export interface CancelInput {
	orderId: string;
	marketplace: MarketplaceKind;
}

export type ValuesOptional<T> = {
	[K in keyof T]: T[K] | undefined;
};

export type RequiredKeys<T> = {
	[K in keyof T]-?: T[K];
};

export type QueryKeyArgs<T> = {
	[K in keyof Required<T>]: T[K] | undefined;
};

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Extracts only API-relevant fields from query params, excluding SDK config and query options
 * Converts optional properties (prop?: T) to explicit union types (prop: T | undefined)
 */
export type ApiArgs<T> = ValuesOptional<Omit<T, 'config' | 'query'>>;
