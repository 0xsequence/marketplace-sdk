import { vi } from 'vitest';
import type { Config } from 'wagmi';
import type { ReactNode } from 'react';
import { zeroAddress } from 'viem';

export type MockWagmiConfig = Config;

/**
 * Common mock implementations for wagmi hooks and functions
 */
export const commonWagmiMocks = {
	useAccount: vi.fn().mockReturnValue({
		address: zeroAddress,
		isConnecting: false,
		isDisconnected: false,
		isReconnecting: false,
		status: 'connected',
	}),
	createConfig: vi.fn().mockReturnValue({
		chains: [],
		connectors: [],
		transports: {},
	}),
	http: vi.fn().mockReturnValue({}),
	WagmiProvider: vi
		.fn()
		.mockImplementation(({ children }: { children: ReactNode }) => children),
};

/**
 * Creates mock wagmi hooks and functions with pre-configured implementations for testing
 * @param overrides - Optional overrides for the default mock implementations
 * @returns Mock wagmi hooks and functions with vitest mock functions
 */
export function createMockWagmi(overrides?: Partial<typeof commonWagmiMocks>) {
	return {
		...commonWagmiMocks,
		...overrides,
	};
}

/**
 * Mock chain data for testing
 */
export const mockChains = {
	mainnet: { id: 1, name: 'Ethereum', network: 'mainnet' },
	sepolia: { id: 11155111, name: 'Sepolia', network: 'sepolia' },
};

/**
 * Mock connector data for testing
 */
export const mockConnectors = {
	mock: () => ({
		accounts: [
			'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			'0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
			'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
		],
	}),
};
