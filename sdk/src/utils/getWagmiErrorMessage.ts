export const getWagmiErrorMessage = (error: Error): string => {
	// ✅ Comprehensive wagmi error handling based on official documentation
	switch (error.name) {
		// User Action Errors
		case 'UserRejectedRequestError':
			return 'Transaction was cancelled. You can try again when ready.';

		// Network & RPC Errors
		case 'HttpRequestError': {
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

		case 'LimitExceededRpcError':
			return 'Rate limit exceeded. Please wait before trying again.';

		case 'TimeoutError':
			return 'Request timed out. Please try again.';

		// Balance & Transaction Errors
		case 'InsufficientFundsError':
			return 'Insufficient balance to complete this transaction.';

		case 'TransactionExecutionError':
			return 'Transaction execution failed. This usually means the transaction would fail on-chain. Please check your transaction parameters.';

		case 'ContractFunctionExecutionError':
			return 'Smart contract function failed. Please verify the contract parameters and try again.';

		case 'TransactionReceiptNotFoundError':
			return 'Transaction not found. It may still be processing or may have failed.';

		// Chain & Network Errors
		case 'ChainMismatchError':
		case 'ConnectorChainMismatchError':
			return 'Wrong network selected. Please switch to the correct network.';

		case 'ChainNotConfiguredError':
			return 'This network is not supported. Please switch to a supported network.';

		case 'SwitchChainNotSupportedError':
			return 'Network switching is not supported by your wallet. Please manually switch networks.';

		// Connector & Wallet Errors
		case 'ConnectorAccountNotFoundError':
			return 'No wallet account found. Please make sure your wallet is properly connected.';

		case 'ConnectorAlreadyConnectedError':
			return "Wallet is already connected. Please refresh the page if you're having issues.";

		case 'ConnectorNotConnectedError':
			return 'Wallet not connected. Please connect your wallet and try again.';

		case 'ConnectorNotFoundError':
		case 'ProviderNotFoundError':
			return 'Wallet not found or unavailable. Please make sure your wallet is installed and unlocked.';

		case 'ConnectorUnavailableReconnectingError':
			return 'Wallet is reconnecting. Please wait a moment and try again.';

		// Gas & Fee Errors
		case 'FeeCapTooLowError':
			return 'Gas fee too low. Please increase the gas fee and try again.';

		case 'IntrinsicGasTooLowError':
			return 'Gas limit too low. Please increase the gas limit and try again.';

		case 'NonceAlreadyUsedError':
			return 'Transaction nonce already used. Please try again.';

		// Contract Errors
		case 'ContractFunctionRevertedError':
			return 'Transaction was reverted by the smart contract. Please check your transaction parameters.';

		case 'ContractFunctionZeroDataError':
			return 'Invalid contract function call. Please verify the function parameters.';

		// Parsing & Data Errors
		case 'InvalidAddressError':
			return 'Invalid wallet address format. Please check the address and try again.';

		case 'InvalidHexError':
			return 'Invalid data format. Please check your input and try again.';

		// Wagmi Provider Errors
		case 'WagmiProviderNotFoundError':
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
