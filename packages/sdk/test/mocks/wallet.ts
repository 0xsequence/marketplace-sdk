import type { TransactionReceipt } from '@0xsequence/indexer';
import { type Hex, custom } from 'viem';
import { vi } from 'vitest';
import { WalletKind } from '../../src';
import type { WalletInstance } from '../../src/react/_internal/wallet/wallet';
import { ChainSwitchUserRejectedError } from '../../src/utils/_internal/error/transaction';

export type MockWallet = WalletInstance;

/**
 * Creates a mock wallet with pre-configured mock functions for testing
 * @param overrides - Optional overrides for the default mock implementations
 * @returns A mock wallet instance with vitest mock functions
 */
export function createMockWallet(overrides?: Partial<MockWallet>): MockWallet {
	const defaultMockWallet: MockWallet = {
		getChainId: vi.fn().mockResolvedValue(1),
		switchChain: vi.fn().mockResolvedValue(undefined),
		address: vi
			.fn()
			.mockResolvedValue('0x0000000000000000000000000000000000000000' as Hex),
		handleSendTransactionStep: vi.fn().mockResolvedValue('0x123' as Hex),
		handleSignMessageStep: vi.fn().mockResolvedValue('0xsignature' as Hex),
		handleConfirmTransactionStep: vi
			.fn()
			.mockResolvedValue({} as TransactionReceipt),
		isWaaS: false,
		transport: custom({
			request: vi.fn(),
		}),
		walletKind: WalletKind.unknown,
		hasTokenApproval: vi.fn().mockResolvedValue(true),
	};

	return {
		...defaultMockWallet,
		...overrides,
	};
}

/**
 * Common mock implementations for wallet functions
 * These are the actual mock functions that can be used directly or as overrides
 */
export const commonWalletMocks: {
	successfulChainId: any;
	successfulAddress: any;
	successfulTransaction: any;
	successfulSignature: any;
	successfulConfirmation: any;
	successfulTokenApproval: any;
	chainSwitchRejection: any;
	transactionFailure: any;
	signatureFailure: any;
} = {
	successfulChainId: vi.fn().mockResolvedValue(1),
	successfulAddress: vi
		.fn()
		.mockResolvedValue('0x0000000000000000000000000000000000000000' as Hex),
	successfulTransaction: vi.fn().mockResolvedValue('0x123' as Hex),
	successfulSignature: vi.fn().mockResolvedValue('0xsignature' as Hex),
	successfulConfirmation: vi.fn().mockResolvedValue({} as TransactionReceipt),
	successfulTokenApproval: vi.fn().mockResolvedValue(true),
	chainSwitchRejection: vi
		.fn()
		.mockRejectedValue(new ChainSwitchUserRejectedError()),
	transactionFailure: vi
		.fn()
		.mockRejectedValue(new Error('Transaction failed')),
	signatureFailure: vi.fn().mockRejectedValue(new Error('Signature failed')),
};
