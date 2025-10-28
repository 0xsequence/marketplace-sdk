// Error name constants to avoid magic strings
const WAGMI_ERROR = {
	USER_REJECTED_REQUEST: 'UserRejectedRequestError',
	HTTP_REQUEST: 'HttpRequestError',
	LIMIT_EXCEEDED_RPC: 'LimitExceededRpcError',
	TIMEOUT: 'TimeoutError',
	INSUFFICIENT_FUNDS: 'InsufficientFundsError',
	TRANSACTION_EXECUTION: 'TransactionExecutionError',
	CONTRACT_FUNCTION_EXECUTION: 'ContractFunctionExecutionError',
	TRANSACTION_RECEIPT_NOT_FOUND: 'TransactionReceiptNotFoundError',
	CHAIN_MISMATCH: 'ChainMismatchError',
	CONNECTOR_CHAIN_MISMATCH: 'ConnectorChainMismatchError',
	CHAIN_NOT_CONFIGURED: 'ChainNotConfiguredError',
	SWITCH_CHAIN_NOT_SUPPORTED: 'SwitchChainNotSupportedError',
	CONNECTOR_ACCOUNT_NOT_FOUND: 'ConnectorAccountNotFoundError',
	CONNECTOR_ALREADY_CONNECTED: 'ConnectorAlreadyConnectedError',
	CONNECTOR_NOT_CONNECTED: 'ConnectorNotConnectedError',
	CONNECTOR_NOT_FOUND: 'ConnectorNotFoundError',
	PROVIDER_NOT_FOUND: 'ProviderNotFoundError',
	CONNECTOR_UNAVAILABLE_RECONNECTING: 'ConnectorUnavailableReconnectingError',
	FEE_CAP_TOO_LOW: 'FeeCapTooLowError',
	INTRINSIC_GAS_TOO_LOW: 'IntrinsicGasTooLowError',
	NONCE_ALREADY_USED: 'NonceAlreadyUsedError',
	CONTRACT_FUNCTION_REVERTED: 'ContractFunctionRevertedError',
	CONTRACT_FUNCTION_ZERO_DATA: 'ContractFunctionZeroDataError',
	INVALID_ADDRESS: 'InvalidAddressError',
	INVALID_HEX: 'InvalidHexError',
	WAGMI_PROVIDER_NOT_FOUND: 'WagmiProviderNotFoundError',
} as const;

const wagmiErrorNames = Object.values(WAGMI_ERROR);

export const isWagmiError = (error: Error): boolean => {
	return wagmiErrorNames.includes(error.name as any);
};

export const getWagmiErrorMessage = (error: Error): string => {
	switch (error.name) {
		// User Action Errors
		case WAGMI_ERROR.USER_REJECTED_REQUEST:
			return 'Transaction was cancelled. You can try again when ready.';

		// Network & RPC Errors
		case WAGMI_ERROR.HTTP_REQUEST: {
			// Use error context if available
			const httpError = error as any;
			if (httpError.status === 429) {
				return 'Rate limit exceeded. Please wait a moment before trying again.';
			}
			if (httpError.status >= 500) {
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

		case WAGMI_ERROR.CHAIN_NOT_CONFIGURED:
			return 'This network is not supported. Please switch to a supported network.';

		case WAGMI_ERROR.SWITCH_CHAIN_NOT_SUPPORTED:
			return 'Network switching is not supported by your wallet. Please manually switch networks.';

		// Connector & Wallet Errors
		case WAGMI_ERROR.CONNECTOR_ACCOUNT_NOT_FOUND:
			return 'No wallet account found. Please make sure your wallet is properly connected.';

		case WAGMI_ERROR.CONNECTOR_ALREADY_CONNECTED:
			return "Wallet is already connected. Please refresh the page if you're having issues.";

		case WAGMI_ERROR.CONNECTOR_NOT_CONNECTED:
			return 'Wallet not connected. Please connect your wallet and try again.';

		case WAGMI_ERROR.CONNECTOR_NOT_FOUND:
		case WAGMI_ERROR.PROVIDER_NOT_FOUND:
			return 'Wallet not found or unavailable. Please make sure your wallet is installed and unlocked.';

		case WAGMI_ERROR.CONNECTOR_UNAVAILABLE_RECONNECTING:
			return 'Wallet is reconnecting. Please wait a moment and try again.';

		// Gas & Fee Errors
		case WAGMI_ERROR.FEE_CAP_TOO_LOW:
			return 'Gas fee too low. Please increase the gas fee and try again.';

		case WAGMI_ERROR.INTRINSIC_GAS_TOO_LOW:
			return 'Gas limit too low. Please increase the gas limit and try again.';

		case WAGMI_ERROR.NONCE_ALREADY_USED:
			return 'Transaction nonce already used. Please try again.';

		// Contract Errors
		case WAGMI_ERROR.CONTRACT_FUNCTION_REVERTED:
			return 'Transaction was reverted by the smart contract. Please check your transaction parameters.';

		case WAGMI_ERROR.CONTRACT_FUNCTION_ZERO_DATA:
			return 'Invalid contract function call. Please verify the function parameters.';

		// Parsing & Data Errors
		case WAGMI_ERROR.INVALID_ADDRESS:
			return 'Invalid wallet address format. Please check the address and try again.';

		case WAGMI_ERROR.INVALID_HEX:
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
