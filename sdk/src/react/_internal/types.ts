import type {
	ContractType,
	CreateReq,
	MarketplaceKind,
} from '@0xsequence/api-client';
import type { Hex } from 'viem';
import type { SdkConfig } from '../../types';
import type {
	StandardInfiniteQueryOptions,
	StandardQueryOptions,
} from '../types/query';
import type { RequiredKeys } from './query-builder';

export type QueryArg = {
	enabled?: boolean;
};

export type CollectableId = string | number;

export type CollectionType = ContractType.ERC1155 | ContractType.ERC721;

export type Transaction = {
	to: Hex;
	data?: Hex;
	value?: bigint;
};

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

export type BuyInput = {
	orderId: string;
	marketplace: MarketplaceKind;
	quantity: string;
};

export type SellInput = {
	orderId: string;
	marketplace: MarketplaceKind;
	quantity?: string;
};

export type ListingInput = {
	contractType: ContractType;
	listing: CreateReq;
};

export type OfferInput = {
	contractType: ContractType;
	offer: CreateReq;
};

export type CancelInput = {
	orderId: string;
	marketplace: MarketplaceKind;
};

export type ValuesOptional<T> = {
	[K in keyof T]: T[K] | undefined;
};

/**
 * Makes all properties in T required (removes optionality)
 * Note: Different from RequiredKeys in query-builder.ts which extracts required key names
 */
export type AllRequired<T> = {
	[K in keyof T]-?: T[K];
};

export type QueryKeyArgs<T> = {
	[K in keyof AllRequired<T>]: T[K] | undefined;
};

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Extracts only API-relevant fields from query params, excluding SDK config and query options
 * Converts optional properties (prop?: T) to explicit union types (prop: T | undefined)
 */
export type ApiArgs<T> = ValuesOptional<Omit<T, 'config' | 'query'>>;

/**
 * Wraps API request types with SDK-specific requirements
 * - Adds config and query fields
 * - Makes all fields optional including config (hooks use useConfig() as default)
 * - Works with standard queries
 */
export type SdkQueryParams<TApiRequest, TQuery = StandardQueryOptions> = {
	[K in keyof TApiRequest]?: TApiRequest[K];
} & {
	config?: SdkConfig;
	query?: TQuery;
};

/**
 * Wraps API request types with SDK-specific requirements for infinite queries
 * - Adds config and query fields
 * - Makes all fields optional including config (hooks use useConfig() as default)
 */
export type SdkInfiniteQueryParams<TApiRequest> = SdkQueryParams<
	TApiRequest,
	StandardInfiniteQueryOptions
>;

/**
 * Makes specified keys required in an object type
 * Used in fetchers to ensure required params exist
 */
export type WithRequired<T, K extends keyof T = keyof T> = T & {
	[P in K]-?: T[P];
};

/**
 * Creates hook params from API request types:
 * - Required API fields → key required, value can be undefined
 * - Optional API fields → key optional (key doesn't need to exist)
 * - SDK fields (config, query) → key optional
 */
export type HookParamsFromApiRequest<
	TApiRequest,
	TSdkParams extends Record<string, unknown> = Record<string, never>,
> = {
	// Required API fields: key required, value can be undefined
	[K in RequiredKeys<TApiRequest>]: TApiRequest[K] | undefined;
} & {
	// Optional API fields: key optional (key doesn't need to exist)
	[K in Exclude<keyof TApiRequest, RequiredKeys<TApiRequest>>]?: TApiRequest[K];
} & {
	// SDK fields: key optional
	[K in keyof TSdkParams]?: TSdkParams[K];
};
