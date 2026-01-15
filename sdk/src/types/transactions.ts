/**
 * Transaction modes for the buy modal
 * Used to distinguish between secondary market purchases and primary sales (minting)
 */
export enum TransactionType {
	/** Secondary market purchases from existing orders */
	MARKET_BUY = 'MARKET_BUY',
	/** Primary sales - direct from creator/contract (minting/shop) */
	PRIMARY_SALE = 'PRIMARY_SALE',
}
