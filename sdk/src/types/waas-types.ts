// TODO: Get these from the @0xsequence/connect package

// Copied from @0xsequence/connect
export type FeeOption = {
	gasLimit: number;
	to: string;
	token: {
		chainId: number;
		contractAddress: string | null;
		decimals: number;
		logoURL: string;
		name: string;
		symbol: string;
		tokenID: string | null;
		type: string;
	};
	value: string;
};

export type FeeOptionExtended = FeeOption & {
	/** Raw balance string */
	balance: string;
	/** Formatted balance with proper decimals */
	balanceFormatted: string;
	/** Indicates if the wallet has enough balance to pay the fee */
	hasEnoughBalanceForFee: boolean;
};
/**
 * Fee option confirmation data structure
 */
export type WaasFeeOptionConfirmation = {
	/** Unique identifier for the fee confirmation */
	id: string;
	/** Available fee options with balance information */
	options: FeeOptionExtended[] | FeeOption[];
	/** Chain ID where the transaction will be executed */
	chainId: number;
};
