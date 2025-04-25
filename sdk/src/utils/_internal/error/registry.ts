import type { ErrorCode } from './codes';
import { ErrorCodes } from './codes';

export interface ErrorDetails {
	message: string;
	details?: string;
	severity: 'error' | 'warning' | 'info';
	docsUrl?: string;
}

/**
 * Registry of all error details keyed by error code
 */
export const ErrorRegistry: Record<ErrorCode, ErrorDetails> = {
	// Transaction errors
	[ErrorCodes.TX_USER_REJECTED]: {
		message: 'User rejected the request',
		details: 'The user cancelled or rejected the transaction request.',
		severity: 'info',
		docsUrl: 'https://docs.yourdomain.com/errors/transaction#user-rejected',
	},
	[ErrorCodes.TX_CHAIN_SWITCH_FAILED]: {
		message: 'Failed to switch network',
		details:
			'The user may have rejected the network switch or there might be a network connectivity issue.',
		severity: 'error',
		docsUrl:
			'https://docs.yourdomain.com/errors/transaction#chain-switch-failed',
	},
	[ErrorCodes.TX_CHAIN_SWITCH_REJECTED]: {
		message: 'User rejected chain switch',
		details: 'The user rejected the chain switch request.',
		severity: 'info',
		docsUrl:
			'https://docs.yourdomain.com/errors/transaction#chain-switch-rejected',
	},
	[ErrorCodes.TX_EXECUTION_FAILED]: {
		message: 'Failed to execute transaction',
		details:
			'The transaction may have been rejected or failed during execution.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/transaction#execution-failed',
	},
	[ErrorCodes.TX_SIGNATURE_FAILED]: {
		message: 'Failed to sign transaction',
		details: 'The signature request may have been rejected by the user.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/transaction#signature-failed',
	},
	[ErrorCodes.TX_CONFIRMATION_FAILED]: {
		message: 'Failed to confirm transaction',
		details: 'The transaction could not be confirmed on the network.',
		severity: 'error',
		docsUrl:
			'https://docs.yourdomain.com/errors/transaction#confirmation-failed',
	},
	[ErrorCodes.TX_RECEIPT_NOT_FOUND]: {
		message: 'Transaction receipt not found',
		details: 'Could not retrieve the transaction receipt from the network.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/transaction#receipt-not-found',
	},
	[ErrorCodes.TX_VALIDATION_FAILED]: {
		message: 'Transaction validation failed',
		details: 'The transaction validation checks failed.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/transaction#validation-failed',
	},
	[ErrorCodes.TX_INSUFFICIENT_FUNDS]: {
		message: 'Insufficient funds for transaction',
		details:
			'The wallet does not have enough funds to complete this transaction.',
		severity: 'error',
		docsUrl:
			'https://docs.yourdomain.com/errors/transaction#insufficient-funds',
	},

	// Wallet errors
	[ErrorCodes.WALLET_NOT_CONNECTED]: {
		message: 'No wallet connected',
		details: 'Please connect your wallet before attempting this transaction.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/wallet#not-connected',
	},
	[ErrorCodes.WALLET_INSTANCE_NOT_FOUND]: {
		message: 'Wallet instance not found',
		details: 'The wallet instance is undefined or not properly initialized.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/wallet#instance-not-found',
	},
	[ErrorCodes.WALLET_CHAIN_ID_UNAVAILABLE]: {
		message: 'Chain ID is not available',
		details: 'Could not determine the current chain ID from the wallet.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/wallet#chain-id-unavailable',
	},

	// Configuration errors
	[ErrorCodes.CONFIG_MISSING]: {
		message: 'Missing required configuration',
		details: 'A required configuration parameter is missing.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/configuration#missing',
	},
	[ErrorCodes.CONFIG_INVALID]: {
		message: 'Invalid configuration',
		details: 'The provided configuration is invalid or malformed.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/configuration#invalid',
	},
	[ErrorCodes.CONFIG_MARKETPLACE_NOT_FOUND]: {
		message: 'Marketplace configuration not found',
		details:
			'The marketplace configuration is missing or invalid. This could be due to an initialization error.',
		severity: 'error',
		docsUrl:
			'https://docs.yourdomain.com/errors/configuration#marketplace-not-found',
	},
	[ErrorCodes.CONFIG_PROJECT_NOT_FOUND]: {
		message: 'Project not found',
		details: 'The specified project could not be found.',
		severity: 'error',
		docsUrl:
			'https://docs.yourdomain.com/errors/configuration#project-not-found',
	},
	[ErrorCodes.CONFIG_FETCH_FAILED]: {
		message: 'Failed to fetch marketplace config',
		details: 'Could not retrieve marketplace configuration data.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/configuration#fetch-failed',
	},

	// Contract/Collection errors
	[ErrorCodes.CONTRACT_INVALID_TYPE]: {
		message: 'Invalid contract type',
		details: 'The contract type must be either ERC721 or ERC1155.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/contract#invalid-type',
	},
	[ErrorCodes.CONTRACT_COLLECTION_NOT_FOUND]: {
		message: 'Collection not found',
		details:
			'The specified collection address could not be found in the marketplace configuration.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/contract#collection-not-found',
	},
	[ErrorCodes.CONTRACT_INVALID_CURRENCY]: {
		message: 'Invalid currency options',
		details:
			'The currency options must be an array of valid currency contract addresses.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/contract#invalid-currency',
	},

	// Order/Transaction step errors
	[ErrorCodes.ORDER_NOT_FOUND]: {
		message: 'Order not found',
		details: 'The requested order could not be found in the marketplace.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/order#not-found',
	},
	[ErrorCodes.STEP_INVALID]: {
		message: 'Invalid step configuration',
		details: 'The transaction step configuration is invalid.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/steps#invalid',
	},
	[ErrorCodes.STEP_EXECUTION_FAILED]: {
		message: 'Failed to execute step',
		details: 'The step execution failed unexpectedly.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/steps#execution-failed',
	},
	[ErrorCodes.STEP_GENERATION_FAILED]: {
		message: 'Failed to generate steps',
		details: 'Could not generate the required transaction steps.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/steps#generation-failed',
	},
	[ErrorCodes.STEP_MISSING_DATA]: {
		message: 'Step is missing required data',
		details:
			'The transaction step is missing required "to" or "signature" data.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/steps#missing-data',
	},
	[ErrorCodes.STEP_MISSING_SIGNATURE]: {
		message: 'Step is missing signature data',
		details:
			'The signature step is missing required signature data configuration.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/steps#missing-signature',
	},
	[ErrorCodes.STEP_INVALID_SIGNATURE]: {
		message: 'Invalid signature step type',
		details: 'The signature step type is not supported.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/steps#invalid-signature',
	},
	[ErrorCodes.STEP_MISSING_POST]: {
		message: 'Missing post step configuration',
		details: 'The signature step is missing required post-step configuration.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/steps#missing-post',
	},
	[ErrorCodes.STEP_UNEXPECTED]: {
		message: 'Unexpected steps found',
		details: 'The transaction contains more steps than expected.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/steps#unexpected',
	},
	[ErrorCodes.STEP_NO_EXECUTION]: {
		message: 'No execution step found',
		details: 'The transaction is missing the required execution step.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/steps#no-execution',
	},
	[ErrorCodes.STEP_NONE_FOUND]: {
		message: 'No steps found',
		details: 'The transaction contains no steps to execute.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/steps#none-found',
	},

	// Payment/Checkout errors
	[ErrorCodes.PAYMENT_MODAL_FAILED]: {
		message: 'Payment modal operation failed',
		details: 'The payment modal operation was unsuccessful.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/payment#modal-failed',
	},
	[ErrorCodes.PAYMENT_TRANSACTION_FAILED]: {
		message: 'Payment modal transaction failed',
		details: 'The transaction initiated from the payment modal failed.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/payment#transaction-failed',
	},
	[ErrorCodes.CHECKOUT_OPTIONS_FAILED]: {
		message: 'Failed to get checkout options',
		details: 'Could not retrieve the checkout options from the marketplace.',
		severity: 'error',
		docsUrl:
			'https://docs.yourdomain.com/errors/payment#checkout-options-failed',
	},

	// Unknown/Unsupported
	[ErrorCodes.UNKNOWN_TRANSACTION_TYPE]: {
		message: 'Unknown transaction type',
		details: 'The specified transaction type is not supported.',
		severity: 'error',
		docsUrl: 'https://docs.yourdomain.com/errors/transaction#unknown-type',
	},
};
