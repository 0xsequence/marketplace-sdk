import { vi } from 'vitest';
import type { PublicClient } from 'viem';

export type MockPublicClient = PublicClient;

/**
 * Common mock implementations for public client functions
 */
export const commonPublicClientMocks = {
	getBalance: vi.fn().mockResolvedValue(BigInt('1000000000000000000')), // 1 ETH
	readContract: vi.fn().mockImplementation(async ({ functionName }) => {
		if (functionName === 'balanceOf') {
			return BigInt('1000000000000000000'); // 1 Token
		}
		if (functionName === 'decimals') {
			return 18;
		}
		return BigInt(0);
	}),
};

/**
 * Creates a mock public client with pre-configured mock functions for testing
 * @param overrides - Optional overrides for the default mock implementations
 * @returns A mock public client instance with vitest mock functions
 */
export function createMockPublicClient(
	overrides?: Partial<MockPublicClient>,
): MockPublicClient {
	const defaultMockPublicClient = {
		getBalance: commonPublicClientMocks.getBalance,
		readContract: commonPublicClientMocks.readContract,
	} as unknown as PublicClient;

	return {
		...defaultMockPublicClient,
		...overrides,
	};
}
