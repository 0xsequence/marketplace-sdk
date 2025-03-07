import type { PublicClient } from 'viem';
import { vi } from 'vitest';

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
