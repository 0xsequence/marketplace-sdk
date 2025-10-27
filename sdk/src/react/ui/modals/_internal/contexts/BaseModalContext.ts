import type { ContractInfo } from '@0xsequence/metadata';
import type { Address } from 'viem';
import type { ErrorAction } from '../components/baseModal/errors/errorActionType';

/**
 * Base modal context interface that all modal providers extend
 * Provides common data and functionality across all modals
 */
export interface BaseModalContext {
	// Common data
	collectionAddress: Address;
	chainId: number;
	collection?: ContractInfo;

	// Common loading states
	isLoading: boolean;
	isProcessing: boolean;

	// Common error handling
	error?: Error | null;
	handleErrorDismiss: () => void;
	handleErrorAction: (error: Error, action: ErrorAction) => void;

	// Modal control
	handleClose: () => void;
}

/**
 * Base modal provider props interface
 * Common props that all modal providers accept
 */
export interface BaseModalProviderProps {
	children: React.ReactNode;
	dependencies?: {
		marketplaceClient?: any;
		analytics?: any;
		transactionService?: any;
	};
}
