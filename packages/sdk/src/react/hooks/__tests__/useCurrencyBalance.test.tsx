import { renderHook, waitFor } from '@test';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { USDC_ADDRESS, USDC_HOLDER } from '../../../../test/const';
import { useCurrencyBalance } from '../useCurrencyBalance';

describe('useCurrencyBalance', () => {
	const defaultArgs = {
		chainId: 1,
		userAddress: USDC_HOLDER,
		currencyAddress: zeroAddress,
	} as const;

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
			{ timeout: 1000000 },
		);

		expect(result.current.error).toBeNull();

		expect(result.current.data).toMatchInlineSnapshot(`
			{
			  "formatted": "0.027750209470313066",
			  "value": 27750209470313066n,
			}
		`);
	});

	it('should fetch ERC20 token balance successfully', async () => {
		const erc20Args = {
			...defaultArgs,
			currencyAddress: USDC_ADDRESS,
		} as const;

		const { result } = renderHook(() => useCurrencyBalance(erc20Args));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.error).toBeNull();

		expect(result.current.data).toMatchInlineSnapshot(`
			{
			  "formatted": "65837250.001467",
			  "value": 65837250001467n,
			}
		`);
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
