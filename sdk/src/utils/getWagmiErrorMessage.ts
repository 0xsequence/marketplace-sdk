import {
	ChainMismatchError,
	ChainNotFoundError,
	ContractFunctionExecutionError,
	ContractFunctionRevertedError,
	ContractFunctionZeroDataError,
	FeeCapTooHighError,
	FeeCapTooLowError,
	HttpRequestError,
	InsufficientFundsError,
	IntrinsicGasTooHighError,
	IntrinsicGasTooLowError,
	InvalidAddressError,
	InvalidHexValueError,
	LimitExceededRpcError,
	NonceTooLowError,
	SwitchChainError,
	TimeoutError,
	TransactionExecutionError,
	TransactionReceiptNotFoundError,
	UserRejectedRequestError,
} from 'viem';
import {
	ChainNotConfiguredError,
	ConnectorAccountNotFoundError,
	ConnectorAlreadyConnectedError,
	ConnectorChainMismatchError,
	ConnectorNotFoundError,
	ConnectorUnavailableReconnectingError,
	ProviderNotFoundError,
	SwitchChainNotSupportedError,
	WagmiProviderNotFoundError,
} from 'wagmi';

const WAGMI_ERROR = {
	USER_REJECTED_REQUEST: UserRejectedRequestError.name,
	HTTP_REQUEST: HttpRequestError.name,
	LIMIT_EXCEEDED_RPC: LimitExceededRpcError.name,
	TIMEOUT: TimeoutError.name,
	INSUFFICIENT_FUNDS: InsufficientFundsError.name,
	TRANSACTION_EXECUTION: TransactionExecutionError.name,
	CONTRACT_FUNCTION_EXECUTION: ContractFunctionExecutionError.name,
	TRANSACTION_RECEIPT_NOT_FOUND: TransactionReceiptNotFoundError.name,
	CHAIN_MISMATCH: ChainMismatchError.name,
	CONNECTOR_CHAIN_MISMATCH: ConnectorChainMismatchError.name,
	CHAIN_NOT_FOUND: ChainNotFoundError.name,
	SWITCH_CHAIN_ERROR: SwitchChainError.name,
	FEE_CAP_TOO_LOW: FeeCapTooLowError.name,
	FEE_CAP_TOO_HIGH: FeeCapTooHighError.name,
	INTRINSIC_GAS_TOO_HIGH: IntrinsicGasTooHighError.name,
	CHAIN_NOT_CONFIGURED: ChainNotConfiguredError.name,
	SWITCH_CHAIN_NOT_SUPPORTED: SwitchChainNotSupportedError.name,
	CONNECTOR_ACCOUNT_NOT_FOUND: ConnectorAccountNotFoundError.name,
	CONNECTOR_ALREADY_CONNECTED: ConnectorAlreadyConnectedError.name,
	PROVIDER_NOT_FOUND: ProviderNotFoundError.name,
	CONNECTOR_UNAVAILABLE_RECONNECTING:
		ConnectorUnavailableReconnectingError.name,
	INTRINSIC_GAS_TOO_LOW: IntrinsicGasTooLowError.name,
	CONTRACT_FUNCTION_REVERTED: ContractFunctionRevertedError.name,
	CONTRACT_FUNCTION_ZERO_DATA: ContractFunctionZeroDataError.name,
	INVALID_ADDRESS: InvalidAddressError.name,
	INVALID_HEX_VALUE: InvalidHexValueError.name,
	WAGMI_PROVIDER_NOT_FOUND: WagmiProviderNotFoundError.name,
	CONNECTOR_NOT_FOUND: ConnectorNotFoundError.name,
	NONCE_TOO_LOW: NonceTooLowError.name,
} as const;

const wagmiErrorClasses = [
	UserRejectedRequestError,
	HttpRequestError,
	LimitExceededRpcError,
	TimeoutError,
	InsufficientFundsError,
	TransactionExecutionError,
	ContractFunctionExecutionError,
	TransactionReceiptNotFoundError,
	ChainMismatchError,
	ConnectorChainMismatchError,
	ChainNotFoundError,
	SwitchChainError,
	FeeCapTooLowError,
	FeeCapTooHighError,
	IntrinsicGasTooHighError,
	ChainNotConfiguredError,
	SwitchChainNotSupportedError,
	ConnectorAccountNotFoundError,
	ConnectorAlreadyConnectedError,
	ProviderNotFoundError,
	ConnectorUnavailableReconnectingError,
	IntrinsicGasTooLowError,
	ContractFunctionRevertedError,
	ContractFunctionZeroDataError,
	InvalidAddressError,
	InvalidHexValueError,
	WagmiProviderNotFoundError,
	ConnectorNotFoundError,
	NonceTooLowError,
];

export const isWagmiError = (error: Error): boolean => {
	return wagmiErrorClasses.some((ErrorClass) => error instanceof ErrorClass);
};

export const getWagmiErrorMessage = (error: Error): string => {
	switch (error.name) {
		// User Action Errors
		case WAGMI_ERROR.USER_REJECTED_REQUEST:
			return 'Transaction was cancelled. You can try again when ready.';

		// Network & RPC Errors
		case WAGMI_ERROR.HTTP_REQUEST: {
			// Use error context if available
			interface HttpError extends Error {
				status?: number;
			}
			const httpError = error as HttpError;
			if (httpError.status === 429) {
				return 'Rate limit exceeded. Please wait a moment before trying again.';
			}
			if (httpError.status && httpError.status >= 500) {
				return 'Server error. Please try again in a few moments.';
			}
			return 'Network connection issue. Please check your connection and try again.';
		}

		case WAGMI_ERROR.LIMIT_EXCEEDED_RPC:
			return 'Rate limit exceeded. Please wait before trying again.';

		case WAGMI_ERROR.TIMEOUT:
			return 'Request timed out. Please try again.';

		// Balance & Transaction Errors
		case WAGMI_ERROR.INSUFFICIENT_FUNDS:
			return 'Insufficient balance to complete this transaction.';

		case WAGMI_ERROR.TRANSACTION_EXECUTION:
			return 'Transaction execution failed. This usually means the transaction would fail on-chain. Please check your transaction parameters.';

		case WAGMI_ERROR.CONTRACT_FUNCTION_EXECUTION:
			return 'Smart contract function failed. Please verify the contract parameters and try again.';

		case WAGMI_ERROR.TRANSACTION_RECEIPT_NOT_FOUND:
			return 'Transaction not found. It may still be processing or may have failed.';

		// Chain & Network Errors
		case WAGMI_ERROR.CHAIN_MISMATCH:
		case WAGMI_ERROR.CONNECTOR_CHAIN_MISMATCH:
			return 'Wrong network selected. Please switch to the correct network.';

		case WAGMI_ERROR.CHAIN_NOT_FOUND:
			return 'Network not found. Please check your network configuration.';

		case WAGMI_ERROR.CHAIN_NOT_CONFIGURED:
			return 'This network is not supported. Please switch to a supported network.';

		case WAGMI_ERROR.SWITCH_CHAIN_ERROR:
			return 'Failed to switch networks. Please try switching manually in your wallet.';

		case WAGMI_ERROR.SWITCH_CHAIN_NOT_SUPPORTED:
			return 'Network switching is not supported by your wallet. Please manually switch networks.';

		// Connector & Wallet Errors
		case WAGMI_ERROR.CONNECTOR_ACCOUNT_NOT_FOUND:
			return 'No wallet account found. Please make sure your wallet is properly connected.';

		case WAGMI_ERROR.CONNECTOR_ALREADY_CONNECTED:
			return "Wallet is already connected. Please refresh the page if you're having issues.";

		case WAGMI_ERROR.CONNECTOR_NOT_FOUND:
		case WAGMI_ERROR.PROVIDER_NOT_FOUND:
			return 'Wallet not found or unavailable. Please make sure your wallet is installed and unlocked.';

		case WAGMI_ERROR.CONNECTOR_UNAVAILABLE_RECONNECTING:
			return 'Wallet is reconnecting. Please wait a moment and try again.';

		// Gas & Fee Errors
		case WAGMI_ERROR.FEE_CAP_TOO_LOW:
			return 'Gas fee too low. Please increase the gas fee and try again.';

		case WAGMI_ERROR.FEE_CAP_TOO_HIGH:
			return 'Gas fee too high. Please reduce the gas fee and try again.';

		case WAGMI_ERROR.INTRINSIC_GAS_TOO_LOW:
			return 'Gas limit too low. Please increase the gas limit and try again.';

		case WAGMI_ERROR.INTRINSIC_GAS_TOO_HIGH:
			return 'Gas limit too high. Please reduce the gas limit and try again.';

		case WAGMI_ERROR.NONCE_TOO_LOW:
			return 'Transaction nonce too low. Please try again.';

		// Contract Errors
		case WAGMI_ERROR.CONTRACT_FUNCTION_REVERTED:
			return 'Transaction was reverted by the smart contract. Please check your transaction parameters.';

		case WAGMI_ERROR.CONTRACT_FUNCTION_ZERO_DATA:
			return 'Invalid contract function call. Please verify the function parameters.';

		// Parsing & Data Errors
		case WAGMI_ERROR.INVALID_ADDRESS:
			return 'Invalid wallet address format. Please check the address and try again.';

		case WAGMI_ERROR.INVALID_HEX_VALUE:
			return 'Invalid data format. Please check your input and try again.';

		// Wagmi Provider Errors
		case WAGMI_ERROR.WAGMI_PROVIDER_NOT_FOUND:
			return 'Wallet connection error. Please refresh the page and try again.';

		// Generic fallbacks for error categories
		default: {
			// Check for common error message patterns
			const message = error.message?.toLowerCase() || '';

			if (
				message.includes('insufficient funds') ||
				message.includes('insufficient balance')
			) {
				return 'Insufficient balance to complete this transaction.';
			}

			if (
				message.includes('user rejected') ||
				message.includes('user denied')
			) {
				return 'Transaction was cancelled. You can try again when ready.';
			}

			if (message.includes('network') || message.includes('connection')) {
				return 'Network connection issue. Please check your connection and try again.';
			}

			if (message.includes('gas') || message.includes('fee')) {
				return 'Gas estimation failed. Please try adjusting the gas settings.';
			}

			// Fallback with more context
			return error.message || 'Transaction error occurred. Please try again.';
		}
	}
};
