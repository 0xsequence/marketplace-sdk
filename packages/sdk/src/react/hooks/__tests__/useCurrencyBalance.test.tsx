import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCurrencyBalance } from '../useCurrencyBalance';
import { renderHook, waitFor } from '../../_internal/test-utils';
import { zeroAddress } from 'viem';
import {
	createMockPublicClient,
	commonPublicClientMocks,
} from '../../_internal/test/mocks/publicClient';
import { getPublicRpcClient } from '../../../utils/get-public-rpc-client';

// Mock the getPublicRpcClient function
vi.mock('../../../utils/get-public-rpc-client', () => ({
	getPublicRpcClient: vi.fn(() => createMockPublicClient()),
}));

describe('useCurrencyBalance', () => {
	const defaultArgs = {
		chainId: 1,
		userAddress: '0x1234567890123456789012345678901234567890' as `0x${string}`,
		currencyAddress: zeroAddress,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should fetch native token balance successfully', async () => {
		const { result } = renderHook(() => useCurrencyBalance(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual({
			value: BigInt('1000000000000000000'),
			formatted: '1',
		});
		expect(result.current.error).toBeNull();
		expect(commonPublicClientMocks.getBalance).toHaveBeenCalledWith({
			address: defaultArgs.userAddress,
		});
	});

	it('should fetch ERC20 token balance successfully', async () => {
		const erc20Args = {
			...defaultArgs,
			currencyAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
		};

		const { result } = renderHook(() => useCurrencyBalance(erc20Args));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual({
			value: BigInt('1000000000000000000'),
			formatted: '1',
		});
		expect(result.current.error).toBeNull();
		expect(commonPublicClientMocks.readContract).toHaveBeenCalledTimes(2);
	});

	it('should return skipToken when required parameters are missing', () => {
		const { result } = renderHook(() =>
			useCurrencyBalance({
				chainId: undefined,
				userAddress: undefined,
				currencyAddress: undefined,
			}),
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.isLoading).toBe(false);
		expect(commonPublicClientMocks.getBalance).not.toHaveBeenCalled();
		expect(commonPublicClientMocks.readContract).not.toHaveBeenCalled();
	});

	it('should handle errors from public client', async () => {
		// Mock error response
		const mockError = new Error('Failed to fetch balance');
		const mockPublicClient = createMockPublicClient({
			getBalance: vi.fn().mockRejectedValue(mockError),
		});

		// Override the mock for this test
		vi.mocked(getPublicRpcClient).mockReturnValue(mockPublicClient);

		const { result } = renderHook(() => useCurrencyBalance(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});
});
