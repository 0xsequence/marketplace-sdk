// Enhanced error types with price context and better debugging information
export type BuyModalError =
	| PriceOverflowError
	| PriceCalculationError
	| InvalidPriceFormatError
	| InvalidQuantityError
	| NetworkError
	| ContractError
	| CheckoutError
	| ValidationError
	| StateError;

export interface PriceOverflowError {
	type: 'PRICE_OVERFLOW';
	maxSafeValue: string;
	attemptedValue: string;
	operation: string;
	timestamp: number;
}

export interface PriceCalculationError {
	type: 'PRICE_CALCULATION_ERROR';
	operation: string;
	inputs: string[];
	originalError?: string;
	timestamp: number;
}

// export interface InsufficientFundsError {
//   type: "INSUFFICIENT_FUNDS";
//   required: Price;
//   available: Price;
//   currency: string;
//   shortfall: Price;
//   timestamp: number;
// }

export interface InvalidPriceFormatError {
	type: 'INVALID_PRICE_FORMAT';
	providedPrice: string;
	expectedFormat: string;
	suggestions?: string[];
	timestamp: number;
}

export interface InvalidQuantityError {
	type: 'INVALID_QUANTITY';
	provided: number;
	min: number;
	max: number;
	available?: number;
	timestamp: number;
}

export interface NetworkError {
	type: 'NETWORK_ERROR';
	message: string;
	retryable: boolean;
	chainId?: number;
	endpoint?: string;
	timestamp: number;
}

export interface ContractError {
	type: 'CONTRACT_ERROR';
	contractAddress: `0x${string}`;
	message: string;
	method?: string;
	chainId?: number;
	blockNumber?: number;
	timestamp: number;
}

export interface CheckoutError {
	type: 'CHECKOUT_ERROR';
	provider: string;
	message: string;
	code?: string;
	retryable: boolean;
	timestamp: number;
}

export interface ValidationError {
	type: 'VALIDATION_ERROR';
	field: string;
	message: string;
	value?: unknown;
	constraints?: Record<string, unknown>;
	timestamp: number;
}

export interface StateError {
	type: 'STATE_ERROR';
	currentState: string;
	attemptedAction: string;
	message: string;
	timestamp: number;
}

// biome-ignore lint/complexity/noStaticOnlyClass: provides better organization and type safety for error creation methods
export class BuyModalErrorFactory {
	static priceOverflow(
		maxSafeValue: string,
		attemptedValue: string,
		operation: string,
	): PriceOverflowError {
		return {
			type: 'PRICE_OVERFLOW',
			maxSafeValue,
			attemptedValue,
			operation,
			timestamp: Date.now(),
		};
	}

	static priceCalculation(
		operation: string,
		inputs: string[],
		originalError?: string,
	): PriceCalculationError {
		return {
			type: 'PRICE_CALCULATION_ERROR',
			operation,
			inputs,
			originalError,
			timestamp: Date.now(),
		};
	}

	//   static insufficientFunds(
	//     required: Price,
	//     available: Price,
	//     currency: string,
	//     shortfall: Price
	//   ): InsufficientFundsError {
	//     return {
	//       type: "INSUFFICIENT_FUNDS",
	//       required,
	//       available,
	//       currency,
	//       shortfall,
	//       timestamp: Date.now(),
	//     };
	//   }

	static invalidPriceFormat(
		providedPrice: string,
		expectedFormat: string,
		suggestions?: string[],
	): InvalidPriceFormatError {
		return {
			type: 'INVALID_PRICE_FORMAT',
			providedPrice,
			expectedFormat,
			suggestions,
			timestamp: Date.now(),
		};
	}

	static invalidQuantity(
		provided: number,
		min: number,
		max: number,
		available?: number,
	): InvalidQuantityError {
		return {
			type: 'INVALID_QUANTITY',
			provided,
			min,
			max,
			available,
			timestamp: Date.now(),
		};
	}

	static networkError(
		message: string,
		retryable: boolean,
		chainId?: number,
		endpoint?: string,
	): NetworkError {
		return {
			type: 'NETWORK_ERROR',
			message,
			retryable,
			chainId,
			endpoint,
			timestamp: Date.now(),
		};
	}

	static contractError(
		contractAddress: `0x${string}`,
		message: string,
		method?: string,
		chainId?: number,
		blockNumber?: number,
	): ContractError {
		return {
			type: 'CONTRACT_ERROR',
			contractAddress,
			message,
			method,
			chainId,
			blockNumber,
			timestamp: Date.now(),
		};
	}

	static checkoutError(
		provider: string,
		message: string,
		code?: string,
		retryable = false,
	): CheckoutError {
		return {
			type: 'CHECKOUT_ERROR',
			provider,
			message,
			code,
			retryable,
			timestamp: Date.now(),
		};
	}

	static validationError(
		field: string,
		message: string,
		value?: unknown,
		constraints?: Record<string, unknown>,
	): ValidationError {
		return {
			type: 'VALIDATION_ERROR',
			field,
			message,
			value,
			constraints,
			timestamp: Date.now(),
		};
	}

	static stateError(
		currentState: string,
		attemptedAction: string,
		message: string,
	): StateError {
		return {
			type: 'STATE_ERROR',
			currentState,
			attemptedAction,
			message,
			timestamp: Date.now(),
		};
	}
}

// Error message formatters for user-friendly display
// biome-ignore lint/complexity/noStaticOnlyClass: Formatter provides good namespacing for error formatting
export class BuyModalErrorFormatter {
	static format(error: BuyModalError): string {
		switch (error.type) {
			case 'PRICE_OVERFLOW':
				return 'Price calculation exceeded safe limits. Please reduce quantity or contact support.';

			case 'PRICE_CALCULATION_ERROR':
				return 'Price calculation failed. Please refresh and try again.';

			//   case "INSUFFICIENT_FUNDS":
			//     return `Insufficient funds. You need ${error.currency} but only have available.`;

			case 'INVALID_PRICE_FORMAT':
				return `Invalid price format. Expected: ${error.expectedFormat}`;

			case 'INVALID_QUANTITY':
				return `Invalid quantity. Must be between ${error.min} and ${error.max}.`;

			case 'NETWORK_ERROR':
				return error.retryable
					? `Network error. ${error.message} Please try again.`
					: `Network unavailable. ${error.message}`;

			case 'CONTRACT_ERROR':
				return `Blockchain error at ${error.contractAddress}. Please refresh and try again.`;

			case 'CHECKOUT_ERROR':
				return error.retryable
					? `Checkout failed with ${error.provider}. Please try again.`
					: `Checkout unavailable with ${error.provider}.`;

			case 'VALIDATION_ERROR':
				return `${error.field}: ${error.message}`;

			case 'STATE_ERROR':
				return `Invalid operation: ${error.message}`;

			default:
				return 'An unexpected error occurred. Please try again.';
		}
	}

	static isRetryable(error: BuyModalError): boolean {
		switch (error.type) {
			case 'NETWORK_ERROR':
			case 'CHECKOUT_ERROR':
				return error.retryable;

			case 'PRICE_CALCULATION_ERROR':
			case 'CONTRACT_ERROR':
				return true;

			default:
				return false;
		}
	}

	static getRecoveryAction(error: BuyModalError): string {
		switch (error.type) {
			//   case "INSUFFICIENT_FUNDS":
			//     return "Add funds to your wallet";

			case 'INVALID_QUANTITY':
				return 'Adjust quantity';

			case 'INVALID_PRICE_FORMAT':
				return 'Enter valid price';

			case 'NETWORK_ERROR':
			case 'CONTRACT_ERROR':
				return 'Retry transaction';

			case 'CHECKOUT_ERROR':
				return 'Try different payment method';

			default:
				return 'Refresh and try again';
		}
	}

	/**
	 * Transform class-based errors (BaseError/TransactionError) to user-friendly BuyModalError
	 * This bridges the internal error system with the modal error system
	 */
	static fromTransactionError(error: Error): BuyModalError {
		// Import transaction errors
		const errorName = error.name || error.constructor.name;

		switch (errorName) {
			case 'PriceCalculationError':
				return BuyModalErrorFactory.priceCalculation(
					'price calculation',
					[],
					error.message,
				);

			case 'SalesContractError': {
				// Extract contract address from error message if available
				const addressMatch = error.message.match(/0x[a-fA-F0-9]{40}/);
				return BuyModalErrorFactory.contractError(
					(addressMatch?.[0] as `0x${string}`) ||
						'0x0000000000000000000000000000000000000000',
					error.message,
				);
			}

			case 'QuantityValidationError': {
				// Parse quantity from error message
				const quantityMatch = error.message.match(/Invalid quantity: (\d+)/);
				const availableMatch = error.message.match(
					/available supply \((\d+)\)/,
				);
				return BuyModalErrorFactory.invalidQuantity(
					Number(quantityMatch?.[1] || 0),
					0,
					Number(availableMatch?.[1] || 0),
				);
			}

			case 'UserRejectedRequestError':
				return BuyModalErrorFactory.checkoutError(
					'user',
					'User cancelled the transaction',
					'USER_REJECTED',
					false,
				);

			case 'NoWalletConnectedError':
				return BuyModalErrorFactory.stateError(
					'disconnected',
					'purchase',
					'Please connect your wallet to continue',
				);

			case 'ChainSwitchError':
			case 'NetworkError':
				return BuyModalErrorFactory.networkError(
					error.message,
					true, // retryable
				);

			case 'ShopDataValidationError':
				return BuyModalErrorFactory.validationError(
					'shop-config',
					error.message,
				);

			default:
				// Generic error for unknown types
				return BuyModalErrorFactory.stateError(
					'unknown',
					'operation',
					error.message || 'An unexpected error occurred',
				);
		}
	}

	/**
	 * Enhanced error wrapper that catches and transforms errors consistently
	 */
	static async withErrorHandling<T>(
		operation: () => Promise<T>,
		_context: string, // Prefixed with underscore to indicate intentionally unused
	): Promise<T> {
		try {
			return await operation();
		} catch (error) {
			// Transform the error to user-friendly format
			const buyModalError = BuyModalErrorFormatter.fromTransactionError(
				error as Error,
			);

			// Re-throw as the original error for error boundaries to catch
			// but attach the transformed error for UI consumption
			const enhancedError = error as Error & { buyModalError?: BuyModalError };
			enhancedError.buyModalError = buyModalError;

			throw enhancedError;
		}
	}
}
