/**
 * SDK-specific error classes with name-based discrimination
 * Following wagmi/viem pattern for error handling
 */

// SDK-specific base error
export class SequenceMarketplaceError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'SequenceMarketplaceError';
		Object.setPrototypeOf(this, SequenceMarketplaceError.prototype);
	}
}

// Transaction-related errors
export class InsufficientBalanceError extends SequenceMarketplaceError {
	readonly required: string;
	readonly available: string;
	readonly token: string;

	constructor(required: string, available: string, token: string) {
		super(
			`Insufficient ${token} balance. Required: ${required}, Available: ${available}`,
		);
		this.name = 'InsufficientBalanceError';
		this.required = required;
		this.available = available;
		this.token = token;
		Object.setPrototypeOf(this, InsufficientBalanceError.prototype);
	}
}

export class UserRejectedError extends SequenceMarketplaceError {
	constructor(operation?: string) {
		super(`User rejected ${operation || 'transaction'}`);
		this.name = 'UserRejectedError';
		Object.setPrototypeOf(this, UserRejectedError.prototype);
	}
}

export class ChainMismatchError extends SequenceMarketplaceError {
	readonly expected: number;
	readonly actual: number;

	constructor(expected: number, actual: number) {
		super(`Chain mismatch. Expected: ${expected}, Current: ${actual}`);
		this.name = 'ChainMismatchError';
		this.expected = expected;
		this.actual = actual;
		Object.setPrototypeOf(this, ChainMismatchError.prototype);
	}
}

export class InvalidContractTypeError extends SequenceMarketplaceError {
	readonly contractAddress: `0x${string}`;
	readonly expectedType: string;
	readonly actualType?: string;

	constructor(
		contractAddress: `0x${string}`,
		expectedType: string,
		actualType?: string,
	) {
		const typeInfo = actualType ? `, got ${actualType}` : '';
		super(
			`Invalid contract type for ${contractAddress}. Expected ${expectedType}${typeInfo}`,
		);
		this.name = 'InvalidContractTypeError';
		this.contractAddress = contractAddress;
		this.expectedType = expectedType;
		this.actualType = actualType;
		Object.setPrototypeOf(this, InvalidContractTypeError.prototype);
	}
}

// Transaction processing errors
export class TransactionStepsError extends SequenceMarketplaceError {
	readonly operation: string;
	readonly context?: Record<string, unknown>;

	constructor(operation: string, context?: Record<string, unknown>) {
		super(`No transaction steps generated for ${operation}`);
		this.name = 'TransactionStepsError';
		this.operation = operation;
		this.context = context;
		Object.setPrototypeOf(this, TransactionStepsError.prototype);
	}
}

export class TransactionStepNotFoundError extends SequenceMarketplaceError {
	readonly stepType: string;
	readonly operation: string;

	constructor(stepType: string, operation: string) {
		super(`${stepType} step not found for ${operation}`);
		this.name = 'TransactionStepNotFoundError';
		this.stepType = stepType;
		this.operation = operation;
		Object.setPrototypeOf(this, TransactionStepNotFoundError.prototype);
	}
}

export class ApprovalStepMissingError extends SequenceMarketplaceError {
	readonly tokenAddress: `0x${string}`;
	readonly spenderAddress?: `0x${string}`;

	constructor(tokenAddress: `0x${string}`, spenderAddress?: `0x${string}`) {
		super(
			`Approval step missing for token ${tokenAddress}${
				spenderAddress ? ` to spender ${spenderAddress}` : ''
			}`,
		);
		this.name = 'ApprovalStepMissingError';
		this.tokenAddress = tokenAddress;
		this.spenderAddress = spenderAddress;
		Object.setPrototypeOf(this, ApprovalStepMissingError.prototype);
	}
}

// Marketplace business logic errors
export class OrderDataUnavailableError extends SequenceMarketplaceError {
	readonly orderId: string;

	constructor(orderId: string) {
		super(`Order data not available for order ${orderId}`);
		this.name = 'OrderDataUnavailableError';
		this.orderId = orderId;
		Object.setPrototypeOf(this, OrderDataUnavailableError.prototype);
	}
}

export class OrderExpiredError extends SequenceMarketplaceError {
	readonly orderId: string;
	readonly expiryDate: Date;

	constructor(orderId: string, expiryDate: Date) {
		super(`Order ${orderId} expired on ${expiryDate.toISOString()}`);
		this.name = 'OrderExpiredError';
		this.orderId = orderId;
		this.expiryDate = expiryDate;
		Object.setPrototypeOf(this, OrderExpiredError.prototype);
	}
}

export class OrderAlreadyFilledError extends SequenceMarketplaceError {
	readonly orderId: string;

	constructor(orderId: string) {
		super(`Order ${orderId} has already been filled`);
		this.name = 'OrderAlreadyFilledError';
		this.orderId = orderId;
		Object.setPrototypeOf(this, OrderAlreadyFilledError.prototype);
	}
}

export class ListingNotActiveError extends SequenceMarketplaceError {
	readonly listingId: string;
	readonly status: string;

	constructor(listingId: string, status: string) {
		super(`Listing ${listingId} is not active (status: ${status})`);
		this.name = 'ListingNotActiveError';
		this.listingId = listingId;
		this.status = status;
		Object.setPrototypeOf(this, ListingNotActiveError.prototype);
	}
}

// Wallet/authentication errors
export class WalletNotConnectedError extends SequenceMarketplaceError {
	constructor(operation?: string) {
		super(
			`Wallet not connected${operation ? ` for ${operation}` : ''}. Please connect your wallet.`,
		);
		this.name = 'WalletNotConnectedError';
		Object.setPrototypeOf(this, WalletNotConnectedError.prototype);
	}
}

export class InvalidWalletTypeError extends SequenceMarketplaceError {
	readonly providedType: string;
	readonly supportedTypes: string[];

	constructor(providedType: string, supportedTypes: string[] = []) {
		super(
			`Invalid wallet type: ${providedType}. Supported types: ${supportedTypes.join(', ')}`,
		);
		this.name = 'InvalidWalletTypeError';
		this.providedType = providedType;
		this.supportedTypes = supportedTypes;
		Object.setPrototypeOf(this, InvalidWalletTypeError.prototype);
	}
}

export class WalletSignatureError extends SequenceMarketplaceError {
	readonly operation: string;
	readonly reason?: string;

	constructor(operation: string, reason?: string) {
		super(
			`Wallet signature failed for ${operation}${reason ? `: ${reason}` : ''}`,
		);
		this.name = 'WalletSignatureError';
		this.operation = operation;
		this.reason = reason;
		Object.setPrototypeOf(this, WalletSignatureError.prototype);
	}
}

// Enhanced validation errors
export class InvalidPriceError extends SequenceMarketplaceError {
	readonly providedPrice: string;
	readonly reason: string;

	constructor(providedPrice: string, reason: string) {
		super(`Invalid price ${providedPrice}: ${reason}`);
		this.name = 'InvalidPriceError';
		this.providedPrice = providedPrice;
		this.reason = reason;
		Object.setPrototypeOf(this, InvalidPriceError.prototype);
	}
}

export class InvalidExpiryError extends SequenceMarketplaceError {
	readonly providedExpiry: Date | string;
	readonly reason: string;

	constructor(providedExpiry: Date | string, reason: string) {
		const expiryStr =
			providedExpiry instanceof Date
				? providedExpiry.toISOString()
				: providedExpiry;
		super(`Invalid expiry ${expiryStr}: ${reason}`);
		this.name = 'InvalidExpiryError';
		this.providedExpiry = providedExpiry;
		this.reason = reason;
		Object.setPrototypeOf(this, InvalidExpiryError.prototype);
	}
}

export class MinimumPriceNotMetError extends SequenceMarketplaceError {
	readonly providedPrice: string;
	readonly minimumPrice: string;
	readonly currency: string;

	constructor(providedPrice: string, minimumPrice: string, currency: string) {
		super(
			`Price ${providedPrice} ${currency} is below minimum price of ${minimumPrice} ${currency}`,
		);
		this.name = 'MinimumPriceNotMetError';
		this.providedPrice = providedPrice;
		this.minimumPrice = minimumPrice;
		this.currency = currency;
		Object.setPrototypeOf(this, MinimumPriceNotMetError.prototype);
	}
}

export class MaximumQuantityExceededError extends SequenceMarketplaceError {
	readonly requestedQuantity: number;
	readonly maxQuantity: number;
	readonly availableQuantity?: number;

	constructor(
		requestedQuantity: number,
		maxQuantity: number,
		availableQuantity?: number,
	) {
		const availableInfo = availableQuantity
			? ` (${availableQuantity} available)`
			: '';
		super(
			`Requested quantity ${requestedQuantity} exceeds maximum ${maxQuantity}${availableInfo}`,
		);
		this.name = 'MaximumQuantityExceededError';
		this.requestedQuantity = requestedQuantity;
		this.maxQuantity = maxQuantity;
		this.availableQuantity = availableQuantity;
		Object.setPrototypeOf(this, MaximumQuantityExceededError.prototype);
	}
}

// Configuration and setup errors
export class MissingConfigurationError extends SequenceMarketplaceError {
	readonly configKey: string;

	constructor(configKey: string, message?: string) {
		super(message || `Required configuration missing: ${configKey}`);
		this.name = 'MissingConfigurationError';
		this.configKey = configKey;
		Object.setPrototypeOf(this, MissingConfigurationError.prototype);
	}
}

export class InvalidProjectAccessKeyError extends SequenceMarketplaceError {
	readonly providedKey: string;

	constructor(providedKey: string) {
		super(`Invalid project access key: ${providedKey || 'empty'}`);
		this.name = 'InvalidProjectAccessKeyError';
		this.providedKey = providedKey;
		Object.setPrototypeOf(this, InvalidProjectAccessKeyError.prototype);
	}
}

export class MarketplaceProviderNotFoundError extends SequenceMarketplaceError {
	constructor() {
		super(
			'MarketplaceProvider not found. Make sure to wrap your app with <MarketplaceProvider>',
		);
		this.name = 'MarketplaceProviderNotFoundError';
		Object.setPrototypeOf(this, MarketplaceProviderNotFoundError.prototype);
	}
}

export class UnsupportedNetworkError extends SequenceMarketplaceError {
	readonly networkId: string | number;

	constructor(networkId: string | number) {
		super(`Network configuration for chain ${networkId} not found`);
		this.name = 'UnsupportedNetworkError';
		this.networkId = networkId;
		Object.setPrototypeOf(this, UnsupportedNetworkError.prototype);
	}
}

// Transaction execution errors
export class ChainSwitchError extends SequenceMarketplaceError {
	readonly currentChain: number;
	readonly targetChain: number;

	constructor(currentChain: number, targetChain: number) {
		super(
			`Failed to switch from chain ${currentChain} to chain ${targetChain}`,
		);
		this.name = 'ChainSwitchError';
		this.currentChain = currentChain;
		this.targetChain = targetChain;
		Object.setPrototypeOf(this, ChainSwitchError.prototype);
	}
}

export class TransactionSignatureError extends SequenceMarketplaceError {
	readonly stepId: string;
	readonly cause?: Error;

	constructor(stepId: string, cause?: Error) {
		super(`Transaction signature failed for step: ${stepId}`);
		this.name = 'TransactionSignatureError';
		this.stepId = stepId;
		this.cause = cause;
		Object.setPrototypeOf(this, TransactionSignatureError.prototype);
	}
}

export class UnknownStepTypeError extends SequenceMarketplaceError {
	readonly stepType: string;

	constructor(stepType: string) {
		super(`Unknown step type: ${stepType}`);
		this.name = 'UnknownStepTypeError';
		this.stepType = stepType;
		Object.setPrototypeOf(this, UnknownStepTypeError.prototype);
	}
}

// Type guards for error discrimination
export const isMarketplaceError = (
	error: Error,
): error is SequenceMarketplaceError => {
	return error instanceof SequenceMarketplaceError;
};

export const isInsufficientBalanceError = (
	error: Error,
): error is InsufficientBalanceError => {
	return error.name === 'InsufficientBalanceError';
};

export const isUserRejectedError = (
	error: Error,
): error is UserRejectedError => {
	return error.name === 'UserRejectedError';
};

export const isChainMismatchError = (
	error: Error,
): error is ChainMismatchError => {
	return error.name === 'ChainMismatchError';
};

export const isInvalidContractTypeError = (
	error: Error,
): error is InvalidContractTypeError => {
	return error.name === 'InvalidContractTypeError';
};

// Transaction processing error type guards
export const isTransactionStepsError = (
	error: Error,
): error is TransactionStepsError => {
	return error.name === 'TransactionStepsError';
};

export const isTransactionStepNotFoundError = (
	error: Error,
): error is TransactionStepNotFoundError => {
	return error.name === 'TransactionStepNotFoundError';
};

export const isApprovalStepMissingError = (
	error: Error,
): error is ApprovalStepMissingError => {
	return error.name === 'ApprovalStepMissingError';
};

// Marketplace business logic error type guards
export const isOrderDataUnavailableError = (
	error: Error,
): error is OrderDataUnavailableError => {
	return error.name === 'OrderDataUnavailableError';
};

export const isOrderExpiredError = (
	error: Error,
): error is OrderExpiredError => {
	return error.name === 'OrderExpiredError';
};

export const isOrderAlreadyFilledError = (
	error: Error,
): error is OrderAlreadyFilledError => {
	return error.name === 'OrderAlreadyFilledError';
};

export const isListingNotActiveError = (
	error: Error,
): error is ListingNotActiveError => {
	return error.name === 'ListingNotActiveError';
};

// Wallet/authentication error type guards
export const isWalletNotConnectedError = (
	error: Error,
): error is WalletNotConnectedError => {
	return error.name === 'WalletNotConnectedError';
};

export const isInvalidWalletTypeError = (
	error: Error,
): error is InvalidWalletTypeError => {
	return error.name === 'InvalidWalletTypeError';
};

export const isWalletSignatureError = (
	error: Error,
): error is WalletSignatureError => {
	return error.name === 'WalletSignatureError';
};

// Enhanced validation error type guards
export const isInvalidPriceError = (
	error: Error,
): error is InvalidPriceError => {
	return error.name === 'InvalidPriceError';
};

export const isInvalidExpiryError = (
	error: Error,
): error is InvalidExpiryError => {
	return error.name === 'InvalidExpiryError';
};

export const isMinimumPriceNotMetError = (
	error: Error,
): error is MinimumPriceNotMetError => {
	return error.name === 'MinimumPriceNotMetError';
};

export const isMaximumQuantityExceededError = (
	error: Error,
): error is MaximumQuantityExceededError => {
	return error.name === 'MaximumQuantityExceededError';
};

// Configuration and setup error type guards
export const isMissingConfigurationError = (
	error: Error,
): error is MissingConfigurationError => {
	return error.name === 'MissingConfigurationError';
};

export const isInvalidProjectAccessKeyError = (
	error: Error,
): error is InvalidProjectAccessKeyError => {
	return error.name === 'InvalidProjectAccessKeyError';
};

export const isMarketplaceProviderNotFoundError = (
	error: Error,
): error is MarketplaceProviderNotFoundError => {
	return error.name === 'MarketplaceProviderNotFoundError';
};

export const isUnsupportedNetworkError = (
	error: Error,
): error is UnsupportedNetworkError => {
	return error.name === 'UnsupportedNetworkError';
};

// Transaction execution error type guards
export const isChainSwitchError = (error: Error): error is ChainSwitchError => {
	return error.name === 'ChainSwitchError';
};

export const isTransactionSignatureError = (
	error: Error,
): error is TransactionSignatureError => {
	return error.name === 'TransactionSignatureError';
};

export const isUnknownStepTypeError = (
	error: Error,
): error is UnknownStepTypeError => {
	return error.name === 'UnknownStepTypeError';
};
