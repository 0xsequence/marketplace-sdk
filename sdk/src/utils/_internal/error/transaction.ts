import type { Address } from '@0xsequence/api-client';
import { BaseError } from './base';

export type TransactionErrorType<name extends string = 'TransactionError'> =
	BaseError & { name: name };

export class TransactionError extends BaseError {
	override name = 'TransactionError';
}

export class ChainSwitchError extends TransactionError {
	override name = 'ChainSwitchError';
	constructor(currentChainId: number, targetChainId: number) {
		super(
			`Failed to switch network from ${currentChainId} to ${targetChainId}`,
			{
				details:
					'The user may have rejected the network switch or there might be a network connectivity issue.',
			},
		);
	}
}

export class ChainSwitchUserRejectedError extends TransactionError {
	override name = 'ChainSwitchUserRejectedError';
	constructor() {
		super('User rejected chain switch', {
			details: 'The user rejected the chain switch request.',
		});
	}
}

export class TransactionExecutionError extends TransactionError {
	override name = 'TransactionExecutionError';
	constructor(stepId: string, cause?: Error) {
		super(`Failed to execute transaction step: ${stepId}`, {
			details:
				cause?.message ||
				'The transaction may have been rejected or failed during execution.',
			cause,
		});
	}
}

export class TransactionSignatureError extends TransactionError {
	override name = 'TransactionSignatureError';
	constructor(stepId: string, cause?: Error) {
		super(`Failed to sign transaction step: ${stepId}`, {
			details:
				cause?.message ||
				'The signature request may have been rejected by the user.',
			cause,
		});
	}
}

export class NoWalletConnectedError extends TransactionError {
	override name = 'NoWalletConnectedError';
	constructor() {
		super('No wallet connected', {
			details: 'Please connect your wallet before attempting this transaction.',
		});
	}
}

export class NoMarketplaceConfigError extends TransactionError {
	override name = 'NoMarketplaceConfigError';
	constructor() {
		super('Marketplace configuration not found', {
			details:
				'The marketplace configuration is missing or invalid. This could be due to an initialization error.',
		});
	}
}

export class UserRejectedRequestError extends TransactionError {
	override name = 'UserRejectedRequestError';
	constructor() {
		super('User rejected the request', {
			details: 'The user cancelled or rejected the transaction request.',
		});
	}
}

export class InsufficientFundsError extends TransactionError {
	override name = 'InsufficientFundsError';
	constructor(cause?: Error) {
		super('Insufficient funds for transaction', {
			details:
				'The wallet does not have enough funds to complete this transaction.',
			cause,
		});
	}
}

export class SignatureExecutionError extends TransactionError {
	override name = 'SignatureExecutionError';
	constructor(signature: string, cause?: Error) {
		super(`Failed  to execute signature: ${signature}`, {
			details: cause?.message || 'The execution of the signature failed.',
			cause,
		});
	}
}

export class StepExecutionError extends TransactionError {
	override name = 'StepExecutionError';
	constructor(stepId: string, cause?: Error) {
		super(`Failed to execute step ${stepId})`, {
			details: cause?.message || 'The step execution failed unexpectedly.',
			cause,
		});
	}
}

export class StepGenerationError extends TransactionError {
	override name = 'StepGenerationError';
	constructor(transactionType: string, cause?: Error) {
		super(`Failed to generate steps for ${transactionType}`, {
			details:
				cause?.message || 'Could not generate the required transaction steps.',
			cause,
		});
	}
}

export class PaymentModalError extends TransactionError {
	override name = 'PaymentModalError';
	constructor(cause?: Error) {
		super('Payment modal operation failed', {
			details:
				cause?.message || 'The payment modal operation was unsuccessful.',
			cause,
		});
	}
}

export class InvalidStepError extends TransactionError {
	override name = 'InvalidStepError';
	constructor(stepId: string, reason: string) {
		super(`Invalid step configuration for ${stepId}`, {
			details: reason,
		});
	}
}

export class TransactionConfirmationError extends TransactionError {
	override name = 'TransactionConfirmationError';
	constructor(hash: string, cause?: Error) {
		super(`Failed to confirm transaction ${hash}`, {
			details:
				cause?.message ||
				'The transaction could not be confirmed on the network.',
			cause,
		});
	}
}

export class OrderNotFoundError extends TransactionError {
	override name = 'OrderNotFoundError';
	constructor(orderId: string) {
		super(`Order ${orderId} not found`, {
			details: 'The requested order could not be found in the marketplace.',
		});
	}
}

export class MissingStepDataError extends TransactionError {
	override name = 'MissingStepDataError';
	constructor() {
		super('Step is missing required data', {
			details:
				'The transaction step is missing required "to" or "signature" data.',
		});
	}
}

export class MissingSignatureDataError extends TransactionError {
	override name = 'MissingSignatureDataError';
	constructor() {
		super('Step is missing signature data', {
			details:
				'The signature step is missing required signature data configuration.',
		});
	}
}

export class InvalidSignatureStepError extends TransactionError {
	override name = 'InvalidSignatureStepError';
	constructor(stepId: string) {
		super(`Invalid signature step type: ${stepId}`, {
			details: 'The signature step type is not supported.',
		});
	}
}

export class MissingPostStepError extends TransactionError {
	override name = 'MissingPostStepError';
	constructor() {
		super('Missing post step configuration', {
			details:
				'The signature step is missing required post-step configuration.',
		});
	}
}

export class UnexpectedStepsError extends TransactionError {
	override name = 'UnexpectedStepsError';
	constructor() {
		super('Unexpected steps found', {
			details: 'The transaction contains more steps than expected.',
		});
	}
}

export class NoExecutionStepError extends TransactionError {
	override name = 'NoExecutionStepError';
	constructor() {
		super('No execution step found', {
			details: 'The transaction is missing the required execution step.',
		});
	}
}

export class NoStepsFoundError extends TransactionError {
	override name = 'NoStepsFoundError';
	constructor() {
		super('No steps found', {
			details: 'The transaction contains no steps to execute.',
		});
	}
}

export class UnknownTransactionTypeError extends TransactionError {
	override name = 'UnknownTransactionTypeError';
	constructor(type: string) {
		super(`Unknown transaction type: ${type}`, {
			details: 'The specified transaction type is not supported.',
		});
	}
}

export class InvalidContractTypeError extends TransactionError {
	override name = 'InvalidContractTypeError';
	constructor(contractType: string | undefined) {
		super(`Invalid contract type: ${contractType}`, {
			details: 'The contract type must be either ERC721 or ERC1155.',
		});
	}
}

export class CollectionNotFoundError extends TransactionError {
	override name = 'CollectionNotFoundError';
	constructor(collectionAddress: Address) {
		super(`Collection not found: ${collectionAddress}`, {
			details:
				'The specified collection address could not be found in the marketplace configuration.',
		});
	}
}

export class InvalidCurrencyOptionsError extends TransactionError {
	override name = 'InvalidCurrencyOptionsError';
	constructor(currencyOptions: Address[]) {
		super(`Invalid currency options: ${currencyOptions.join(', ')}`, {
			details:
				'The currency options must be an array of valid currency contract addresses.',
		});
	}
}

export class ProjectNotFoundError extends TransactionError {
	override name = 'ProjectNotFoundError';
	constructor(projectId: string, url: string) {
		super('Project not found', {
			details: `Project id: ${projectId} not found at ${url}`,
		});
	}
}

export class MarketplaceConfigFetchError extends TransactionError {
	override name = 'MarketplaceConfigFetchError';
	constructor(message: string) {
		super('Failed to fetch marketplace config', {
			details: message,
		});
	}
}

export class MissingConfigError extends TransactionError {
	override name = 'MissingConfigError';
	constructor(configName: string) {
		super(`Missing required config: ${configName}`, {
			details: 'A required configuration parameter is missing.',
		});
	}
}

export class TransactionValidationError extends TransactionError {
	override name = 'TransactionValidationError';
	constructor(reason: string) {
		super('Transaction validation failed', {
			details: reason,
		});
	}
}

export class ChainIdUnavailableError extends TransactionError {
	override name = 'ChainIdUnavailableError';
	constructor() {
		super('Chain ID is not available', {
			details: 'Could not determine the current chain ID from the wallet.',
		});
	}
}

export class TransactionReceiptError extends TransactionError {
	override name = 'TransactionReceiptError';
	constructor(hash: string, cause?: Error) {
		super(`Failed to get transaction receipt for ${hash}`, {
			details:
				cause?.message ||
				'Could not retrieve the transaction receipt from the network.',
			cause,
		});
	}
}

export class PaymentModalTransactionError extends TransactionError {
	override name = 'PaymentModalTransactionError';
	constructor(hash: string, cause?: Error) {
		super(`Payment modal transaction failed for ${hash}`, {
			details:
				cause?.message ||
				'The transaction initiated from the payment modal failed.',
			cause,
		});
	}
}

export class CheckoutOptionsError extends TransactionError {
	override name = 'CheckoutOptionsError';
	constructor(cause?: Error) {
		super('Failed to get checkout options', {
			details:
				cause?.message ||
				'Could not retrieve the checkout options from the marketplace.',
			cause,
		});
	}
}

export class OrdersFetchError extends TransactionError {
	override name = 'OrdersFetchError';
	constructor(orderId: string, cause?: Error) {
		super(`Failed to fetch order ${orderId}`, {
			details:
				cause?.message ||
				'Could not retrieve the order details from the marketplace.',
			cause,
		});
	}
}

export class SalesContractError extends TransactionError {
	override name = 'SalesContractError';
	constructor(contractAddress: Address, method?: string, cause?: Error) {
		super(`Sales contract operation failed: ${contractAddress}`, {
			details: `Failed to interact with sales contract${
				method ? ` on method: ${method}` : ''
			}. ${cause?.message || 'Contract may be paused or misconfigured.'}`,
			cause,
		});
	}
}

export class QuantityValidationError extends TransactionError {
	override name = 'QuantityValidationError';
	constructor(provided: number, available: number, tokenId?: string) {
		super(`Invalid quantity: ${provided}`, {
			details: `Requested quantity (${provided}) exceeds available supply (${available})${
				tokenId ? ` for token ${tokenId}` : ''
			}.`,
		});
	}
}

export class ShopDataValidationError extends TransactionError {
	override name = 'ShopDataValidationError';
	constructor(missingField: string) {
		super(`Invalid shop configuration: missing ${missingField}`, {
			details: `The shop is missing required field: ${missingField}. Check your marketplace configuration.`,
		});
	}
}

export type TransactionErrorTypes =
	| ChainIdUnavailableError
	| TransactionReceiptError
	| PaymentModalTransactionError
	| CheckoutOptionsError
	| OrdersFetchError
	| TransactionConfirmationError
	| TransactionValidationError
	| MissingConfigError
	| MarketplaceConfigFetchError
	| ProjectNotFoundError
	| CollectionNotFoundError
	| InvalidCurrencyOptionsError
	| InvalidContractTypeError
	| UnknownTransactionTypeError
	| NoStepsFoundError
	| NoExecutionStepError
	| UnexpectedStepsError
	| MissingPostStepError
	| InvalidSignatureStepError
	| MissingSignatureDataError
	| MissingStepDataError
	| OrderNotFoundError
	 
	| InvalidStepError
	| PaymentModalError
	| StepGenerationError
	| StepExecutionError
	| UserRejectedRequestError
	| NoMarketplaceConfigError
	| InsufficientFundsError
	| ChainSwitchUserRejectedError
	| ChainSwitchError
	| TransactionSignatureError
	| TransactionExecutionError
	| NoWalletConnectedError
	| TransactionError
	| SalesContractError
	| QuantityValidationError
	| ShopDataValidationError;
