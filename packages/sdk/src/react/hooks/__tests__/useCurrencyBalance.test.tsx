import { renderHook, waitFor } from '@test';
import { TEST_ACCOUNTS } from '@test/const';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCurrencyBalance } from '../useCurrencyBalance';

describe('useCurrencyBalance', () => {
	const defaultArgs = {
		chainId: 1,
		userAddress: TEST_ACCOUNTS[0],
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
		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
			},
			{ timeout: 100000 },
		);

		// Verify the data matches our mock
		expect(result.current.data).toMatchInlineSnapshot(`
			{
			  "formatted": "4722.366482869645213697",
			  "value": 4722366482869645213697n,
			}
		`);
		console.log(result.current.error);
		expect(result.current.error).toBeNull();
	});

	it.skip('should fetch ERC20 token balance successfully', async () => {
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
		// expect(commonPublicClientMocks.readContract).toHaveBeenCalledTimes(2);
	});

	it.skip('should return skipToken when required parameters are missing', () => {
		const { result } = renderHook(() =>
			useCurrencyBalance({
				chainId: undefined,
				userAddress: undefined,
				currencyAddress: undefined,
			}),
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.isLoading).toBe(false);
		// expect(commonPublicClientMocks.getBalance).not.toHaveBeenCalled();
		// expect(commonPublicClientMocks.readContract).not.toHaveBeenCalled();
	});

	it.skip('should handle errors from public client', async () => {
		// Mock error response
		// const mockError = new Error('Failed to fetch balance');
		// const mockPublicClient = createMockPublicClient({
		// 	getBalance: vi.fn().mockRejectedValue(mockError),
		// });

		// Override the mock for this test
		// vi.mocked(getPublicRpcClient).mockReturnValue(mockPublicClient);

		const { result } = renderHook(() => useCurrencyBalance(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});
});
