import type { Address } from 'viem';
import type { ContractType, CreateReq } from '../../types';
import type { MarketplaceKind } from './api';

/**
 * Query configuration options for React Query hooks
 */
export interface QueryArg {
	/** Whether the query should be enabled/disabled */
	enabled?: boolean;
}

/**
 * Represents a collectable/token ID that can be either a string or number
 */
export type CollectableId = string | number;

/**
 * Supported NFT collection contract types
 */
export type CollectionType = ContractType.ERC1155 | ContractType.ERC721;

/**
 * Represents a single step in a multi-step transaction process
 */
type TransactionStep = {
	/** Whether this step exists/is required */
	exist: boolean;
	/** Whether this step is currently being executed */
	isExecuting: boolean;
	/** Function to execute this step */
	execute: () => Promise<void>;
};

/**
 * Configuration for multi-step transaction processes
 */
export type TransactionSteps = {
	/** Token approval step (required for most marketplace transactions) */
	approval: TransactionStep;
	/** Main transaction step */
	transaction: TransactionStep;
};

/**
 * Types of marketplace transactions that can be performed
 */
export enum TransactionType {
	/** Purchase a listed NFT */
	BUY = 'BUY',
	/** Accept an offer on your NFT */
	SELL = 'SELL',
	/** Create a listing to sell your NFT */
	LISTING = 'LISTING',
	/** Make an offer on an NFT */
	OFFER = 'OFFER',
	/** Transfer an NFT to another address */
	TRANSFER = 'TRANSFER',
	/** Cancel an existing order */
	CANCEL = 'CANCEL',
}

/**
 * Input parameters for purchasing a collectable
 */
export interface BuyInput {
	/** The unique identifier of the order to purchase */
	orderId: string;
	/** Number of decimal places for the collectable quantity */
	collectableDecimals: number;
	/** The marketplace where the order is listed */
	marketplace: MarketplaceKind;
	/** The quantity of collectables to purchase */
	quantity: string;
}

/**
 * Input parameters for selling a collectable (accepting an offer)
 */
export interface SellInput {
	/** The unique identifier of the offer to accept */
	orderId: string;
	/** The marketplace where the offer was made */
	marketplace: MarketplaceKind;
	/** Optional quantity to sell (defaults to full offer quantity) */
	quantity?: string;
}

/**
 * Input parameters for creating a listing
 */
export interface ListingInput {
	/** The type of contract (ERC721 or ERC1155) */
	contractType: ContractType;
	/** The listing details including price, expiry, etc. */
	listing: CreateReq;
}

/**
 * Input parameters for making an offer
 */
export interface OfferInput {
	/** The type of contract (ERC721 or ERC1155) */
	contractType: ContractType;
	/** The offer details including price, expiry, etc. */
	offer: CreateReq;
}

/**
 * Input parameters for canceling an order
 */
export interface CancelInput {
	/** The unique identifier of the order to cancel */
	orderId: string;
	/** The marketplace where the order was created */
	marketplace: MarketplaceKind;
}
