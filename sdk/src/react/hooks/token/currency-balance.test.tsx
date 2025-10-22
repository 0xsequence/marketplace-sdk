import { renderHook, waitFor } from '@test';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { USDC_ADDRESS, USDC_HOLDER } from '../../../../test/const';
import { useTokenCurrencyBalance } from './currency-balance';

describe('useTokenCurrencyBalance', () => {
	const defaultArgs = {
		chainId: 1,
		userAddress: USDC_HOLDER,
		currencyAddress: zeroAddress,
	} as const;

	it('should fetch native token balance successfully', async () => {
		const { result } = renderHook(() => useTokenCurrencyBalance(defaultArgs));

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

		const { result } = renderHook(() => useTokenCurrencyBalance(erc20Args));

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

	it('should handle disabled query when enabled is false', () => {
		const { result } = renderHook(() =>
			useTokenCurrencyBalance({
				chainId: 1,
				currencyAddress: zeroAddress,
				userAddress: USDC_HOLDER,
				query: {
					enabled: false,
				},
			}),
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSuccess).toBe(false);
		expect(result.current.isError).toBe(false);
	});
});
