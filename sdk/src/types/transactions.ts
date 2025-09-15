import type { Address } from 'viem';
import type { AdditionalFee, MarketplaceKind } from '../react/_internal/api';

/**
 * Transaction types supported by the new buy modal
 */
export enum TransactionType {
	MARKET_BUY = 'MARKET_BUY', // Secondary market purchases
	PRIMARY_SALE = 'PRIMARY_SALE', // Direct from creator/contract
}

/**
 * Base transaction parameters
 */
export interface BaseTransactionParams {
	chainId: number;
	buyer: Address;
	recipient?: Address;
	transactionType: TransactionType;
}

/**
 * Market transaction parameters (secondary sales)
 */
export interface MarketTransactionParams extends BaseTransactionParams {
	transactionType: TransactionType.MARKET_BUY;
	collectionAddress: Address;
	marketplace: MarketplaceKind;
	orderId: string;
	collectibleId: string;
	quantity: string;
	additionalFees: AdditionalFee[];
}

/**
 * Primary sale transaction parameters (minting/shop)
 */
export interface PrimarySaleTransactionParams extends BaseTransactionParams {
	transactionType: TransactionType.PRIMARY_SALE;
	collectionAddress: Address;
	salesContractAddress: Address;
	tokenIds: string[];
	amounts: number[];
	maxTotal: string;
	paymentToken: Address;
	merkleProof?: string[];
	contractVersion: 'v1';
	tokenType: 'ERC721' | 'ERC1155';
}

/**
 * Union type for all transaction parameters
 */
export type TransactionParams =
	| MarketTransactionParams
	| PrimarySaleTransactionParams;

/**
 * Parameters for the useTransactionSteps hook
 */
export interface TransactionStepsParams extends BaseTransactionParams {
	enabled?: boolean;
}

/**
 * Native token address constant
 */
export const NATIVE_TOKEN_ADDRESS =
	'0x0000000000000000000000000000000000000000' as Address;
