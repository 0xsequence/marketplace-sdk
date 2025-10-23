/**
 * Error type definitions for TypeScript power users
 * Following wagmi/viem pattern of exporting union types for error discrimination
 */

// Re-export all error types for external consumption
export type {
	InvalidArgumentError,
	InvalidTierError,
	MethodNotFoundError,
	NotFoundError,
	NotImplementedError,
	PermissionDeniedError,
	ProjectLimitReachedError,
	ProjectNotFoundError,
	SessionExpiredError,
	TimeoutError,
	UnauthorizedError,
	UserNotFoundError,
	WebrpcBadMethodError,
	WebrpcBadRequestError,
	WebrpcBadResponseError,
	WebrpcBadRouteError,
	WebrpcClientDisconnectedError,
	WebrpcEndpointError,
	WebrpcError,
	WebrpcInternalErrorError,
	WebrpcRequestFailedError,
	WebrpcServerPanicError,
	WebrpcStreamFinishedError,
	WebrpcStreamLostError,
} from '../react/_internal/api/marketplace.gen';

export type {
	ApprovalStepMissingError,
	ChainMismatchError,
	// Transaction execution errors
	ChainSwitchError,
	InsufficientBalanceError,
	InvalidContractTypeError,
	InvalidExpiryError,
	// Enhanced validation errors
	InvalidPriceError,
	InvalidProjectAccessKeyError,
	InvalidWalletTypeError,
	ListingNotActiveError,
	MarketplaceProviderNotFoundError,
	MaximumQuantityExceededError,
	MinimumPriceNotMetError,
	// Configuration and setup errors
	MissingConfigurationError,
	OrderAlreadyFilledError,
	// Marketplace business logic errors
	OrderDataUnavailableError,
	OrderExpiredError,
	SequenceMarketplaceError,
	TransactionSignatureError,
	TransactionStepNotFoundError,
	// Transaction processing errors
	TransactionStepsError,
	UnknownStepTypeError,
	UnsupportedNetworkError,
	UserRejectedError,
	// Wallet/authentication errors
	WalletNotConnectedError,
	WalletSignatureError,
} from '../utils/errors';

// Re-export type guards
export {
	isApprovalStepMissingError,
	isChainMismatchError,
	// Transaction execution error type guards
	isChainSwitchError,
	isInsufficientBalanceError,
	isInvalidContractTypeError,
	isInvalidExpiryError,
	// Enhanced validation error type guards
	isInvalidPriceError,
	isInvalidProjectAccessKeyError,
	isInvalidWalletTypeError,
	isListingNotActiveError,
	isMarketplaceError,
	isMarketplaceProviderNotFoundError,
	isMaximumQuantityExceededError,
	isMinimumPriceNotMetError,
	// Configuration and setup error type guards
	isMissingConfigurationError,
	isOrderAlreadyFilledError,
	// Marketplace business logic error type guards
	isOrderDataUnavailableError,
	isOrderExpiredError,
	isTransactionSignatureError,
	isTransactionStepNotFoundError,
	// Transaction processing error type guards
	isTransactionStepsError,
	isUnknownStepTypeError,
	isUnsupportedNetworkError,
	isUserRejectedError,
	// Wallet/authentication error type guards
	isWalletNotConnectedError,
	isWalletSignatureError,
} from '../utils/errors';

// Union types for specific operations (following wagmi pattern)
// TypeScript will resolve these from the re-exports above
export type SubmitTransactionErrorType =
	| import('../utils/errors').InsufficientBalanceError
	| import('../utils/errors').UserRejectedError
	| import('../utils/errors').ChainMismatchError
	| import('../utils/errors').TransactionStepsError
	| import('../utils/errors').TransactionStepNotFoundError
	| import('../utils/errors').WalletNotConnectedError
	| import('../utils/errors').WalletSignatureError
	| import('../react/_internal/api/marketplace.gen').UnauthorizedError
	| import('../react/_internal/api/marketplace.gen').PermissionDeniedError
	| import('../react/_internal/api/marketplace.gen').SessionExpiredError
	| import('../react/_internal/api/marketplace.gen').TimeoutError
	| import('../react/_internal/api/marketplace.gen').NotFoundError
	| import('../react/_internal/api/marketplace.gen').WebrpcError;

export type ApprovalErrorType =
	| import('../utils/errors').InsufficientBalanceError
	| import('../utils/errors').UserRejectedError
	| import('../utils/errors').ChainMismatchError
	| import('../utils/errors').InvalidContractTypeError
	| import('../utils/errors').ApprovalStepMissingError
	| import('../utils/errors').WalletNotConnectedError
	| import('../utils/errors').WalletSignatureError
	| import('../react/_internal/api/marketplace.gen').UnauthorizedError
	| import('../react/_internal/api/marketplace.gen').PermissionDeniedError
	| import('../react/_internal/api/marketplace.gen').TimeoutError;

export type ValidationErrorType =
	| import('../react/_internal/api/marketplace.gen').InvalidArgumentError
	| import('../utils/errors').InvalidContractTypeError
	| import('../utils/errors').ChainMismatchError
	| import('../utils/errors').InvalidPriceError
	| import('../utils/errors').InvalidExpiryError
	| import('../utils/errors').MinimumPriceNotMetError
	| import('../utils/errors').MaximumQuantityExceededError
	| import('../react/_internal/api/marketplace.gen').NotFoundError;

export type MarketplaceOperationErrorType =
	| import('../utils/errors').OrderDataUnavailableError
	| import('../utils/errors').OrderExpiredError
	| import('../utils/errors').OrderAlreadyFilledError
	| import('../utils/errors').ListingNotActiveError
	| import('../react/_internal/api/marketplace.gen').NotFoundError
	| import('../react/_internal/api/marketplace.gen').UnauthorizedError
	| import('../react/_internal/api/marketplace.gen').PermissionDeniedError;

export type WalletErrorType =
	| import('../utils/errors').WalletNotConnectedError
	| import('../utils/errors').InvalidWalletTypeError
	| import('../utils/errors').WalletSignatureError
	| import('../utils/errors').UserRejectedError
	| import('../utils/errors').ChainMismatchError;

// Common error names for discrimination (following wagmi pattern)
export type MarketplaceErrorName =
	// WebRPC Protocol Errors
	| 'WebrpcError'
	| 'WebrpcEndpointError'
	| 'WebrpcRequestFailedError'
	| 'WebrpcBadRouteError'
	| 'WebrpcBadMethodError'
	| 'WebrpcBadRequestError'
	| 'WebrpcBadResponseError'
	| 'WebrpcServerPanicError'
	| 'WebrpcInternalErrorError'
	| 'WebrpcClientDisconnectedError'
	| 'WebrpcStreamLostError'
	| 'WebrpcStreamFinishedError'
	// WebRPC Business Errors
	| 'UnauthorizedError'
	| 'PermissionDeniedError'
	| 'SessionExpiredError'
	| 'MethodNotFoundError'
	| 'TimeoutError'
	| 'InvalidArgumentError'
	| 'NotFoundError'
	| 'UserNotFoundError'
	| 'ProjectNotFoundError'
	| 'InvalidTierError'
	| 'ProjectLimitReachedError'
	| 'NotImplementedError'
	// SDK-specific Base Errors
	| 'SequenceMarketplaceError'
	| 'InsufficientBalanceError'
	| 'UserRejectedError'
	| 'ChainMismatchError'
	| 'InvalidContractTypeError'
	// Transaction Processing Errors
	| 'TransactionStepsError'
	| 'TransactionStepNotFoundError'
	| 'ApprovalStepMissingError'
	// Marketplace Business Logic Errors
	| 'OrderDataUnavailableError'
	| 'OrderExpiredError'
	| 'OrderAlreadyFilledError'
	| 'ListingNotActiveError'
	// Wallet/Authentication Errors
	| 'WalletNotConnectedError'
	| 'InvalidWalletTypeError'
	| 'WalletSignatureError'
	// Enhanced Validation Errors
	| 'InvalidPriceError'
	| 'InvalidExpiryError'
	| 'MinimumPriceNotMetError'
	| 'MaximumQuantityExceededError'
	// Configuration and Setup Errors
	| 'MissingConfigurationError'
	| 'InvalidProjectAccessKeyError'
	| 'MarketplaceProviderNotFoundError'
	| 'UnsupportedNetworkError'
	// Transaction Execution Errors
	| 'ChainSwitchError'
	| 'TransactionSignatureError'
	| 'UnknownStepTypeError';
