import { IndexerMocks } from '@0xsequence/api-client';

const { mockIndexerEndpoint, mockIndexerHandler, mockTokenBalance } =
	IndexerMocks;

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDisconnect } from 'wagmi';
import type { FeeOption } from '../../../types/waas-types';
import { useAutoSelectFeeOption } from './useAutoSelectFeeOption';

describe('useAutoSelectFeeOption', () => {
	const mockChainId = 1;

	const mockFeeOptions: FeeOption[] = [
		{
			token: {
				chainId: mockChainId,
				contractAddress: null,
				decimals: 18,
				logoURL: 'https://example.com/eth.png',
				name: 'Ethereum',
				symbol: 'ETH',
				tokenID: null,
				type: 'NATIVE',
			},
			value: '1000000000000000000', // 1 ETH
			gasLimit: 21000,
			to: zeroAddress,
		},
		{
			token: {
				chainId: mockChainId,
				contractAddress: '0x1234567890123456789012345678901234567890',
				decimals: 6,
				logoURL: 'https://example.com/usdc.png',
				name: 'USD Coin',
				symbol: 'USDC',
				tokenID: null,
				type: 'ERC20',
			},
			value: '1000000', // 1 USDC
			gasLimit: 21000,
			to: zeroAddress,
		},
	];

	const defaultArgs = {
		pendingFeeOptionConfirmation: {
			id: 'test-id',
			options: mockFeeOptions,
			chainId: mockChainId,
		},
	};

	beforeEach(() => {
		// Set up default handler for successful balance check
		server.use(
			mockIndexerHandler('GetTokenBalancesDetails', {
				page: { page: 1, pageSize: 10, more: false },
				balances: [
					{
						...mockTokenBalance,
						balance: '2000000000000000000', // 2 ETH
						contractAddress: zeroAddress,
					},
				],
				nativeBalances: [
					{
						accountAddress: mockTokenBalance.accountAddress,
						balance: '2000000000000000000', // 2 ETH
						blockHash: '0x1234',
						blockNumber: 1234567,
					},
				],
			}),
		);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should select the first fee option with sufficient balance', async () => {
		const { result } = renderHook(() => useAutoSelectFeeOption(defaultArgs));

		// Wait for the hook to complete
		await waitFor(
			async () => {
				const response = await result.current;
				expect(response.selectedOption).toBe(mockFeeOptions[0]);
			},
			{ timeout: 5000 },
		);

		// Verify final state
		const finalResponse = await result.current;
		expect(finalResponse).toEqual({
			selectedOption: mockFeeOptions[0],
			error: null,
		});
	});

	it('should return InsufficientBalanceForAnyFeeOption error when user has insufficient balance for all options', async () => {
		// Override handler for insufficient balances
		server.use(
			mockIndexerHandler('GetTokenBalancesDetails', {
				page: { page: 1, pageSize: 10, more: false },
				balances: [
					{
						...mockTokenBalance,
						balance: '500000000000000000', // 0.5 ETH (less than required 1 ETH)
						contractAddress: zeroAddress,
					},
				],
				nativeBalances: [
					{
						accountAddress: mockTokenBalance.accountAddress,
						balance: '500000000000000000', // 0.5 ETH
						blockHash: '0x1234',
						blockNumber: 1234567,
					},
				],
			}),
		);

		const { result } = renderHook(() => useAutoSelectFeeOption(defaultArgs));

		// Wait for the hook to complete
		await waitFor(async () => {
			const response = await result.current;
			expect(response.error).toBe('Insufficient balance for any fee option');
		});

		// Verify final state
		const finalResponse = await result.current;
		expect(finalResponse).toEqual({
			selectedOption: null,
			error: 'Insufficient balance for any fee option',
		});
	});

	it('should select second fee option when user has insufficient balance for first but sufficient for second', async () => {
		// Override handler for mixed balance scenario
		server.use(
			mockIndexerHandler('GetTokenBalancesDetails', {
				page: { page: 1, pageSize: 10, more: false },
				balances: [
					{
						...mockTokenBalance,
						balance: '500000000000000000', // 0.5 ETH (less than required 1 ETH)
						contractAddress: zeroAddress,
					},
					{
						...mockTokenBalance,
						balance: '2000000', // 2 USDC (more than required 1 USDC)
						contractAddress: '0x1234567890123456789012345678901234567890',
					},
				],
				nativeBalances: [
					{
						accountAddress: mockTokenBalance.accountAddress,
						balance: '500000000000000000', // 0.5 ETH
						blockHash: '0x1234',
						blockNumber: 1234567,
					},
				],
			}),
		);

		const { result } = renderHook(() => useAutoSelectFeeOption(defaultArgs));

		// Wait for the hook to complete
		await waitFor(async () => {
			const response = await result.current;
			expect(response.selectedOption).toBe(mockFeeOptions[1]);
		});

		// Verify final state
		const finalResponse = await result.current;
		expect(finalResponse).toEqual({
			selectedOption: mockFeeOptions[1],
			error: null,
		});
	});

	it('should return NoOptionsProvided error when fee options are undefined', async () => {
		const argsWithNoOptions = {
			pendingFeeOptionConfirmation: {
				id: 'test-id',
				options: undefined,
				chainId: mockChainId,
			},
		};

		const { result } = renderHook(() =>
			useAutoSelectFeeOption(argsWithNoOptions),
		);

		// Wait for the hook to complete
		await waitFor(async () => {
			const response = await result.current;
			expect(response.error).toBe('No options provided');
		});

		// Verify final state
		const finalResponse = await result.current;
		expect(finalResponse).toEqual({
			selectedOption: null,
			error: 'No options provided',
		});
	});

	it('should return FailedToCheckBalances error when balance checking fails', async () => {
		// Override handler to simulate API error
		server.use(
			http.post(mockIndexerEndpoint('GetTokenBalancesDetails'), () => {
				return new HttpResponse(null, {
					status: 500,
					statusText: 'Internal Server Error',
				});
			}),
		);

		const { result } = renderHook(() => useAutoSelectFeeOption(defaultArgs));

		// Wait for the hook to complete
		await waitFor(async () => {
			const response = await result.current;
			expect(response.error).toBe('Failed to check balances');
		});

		// Verify final state
		const finalResponse = await result.current;
		expect(finalResponse).toEqual({
			selectedOption: null,
			error: 'Failed to check balances',
		});
	});

	it('should return UserNotConnected error when wallet is not connected', async () => {
		const { result: disconnect } = renderHook(() => useDisconnect(), {
			autoConnect: false,
		});
		await disconnect.current.disconnectAsync();

		const { result } = renderHook(() => useAutoSelectFeeOption(defaultArgs), {
			autoConnect: false,
		});

		// Wait for the hook to complete
		await waitFor(async () => {
			const response = await result.current;
			expect(response.error).toBe('User not connected');
		});

		// Verify final state
		const finalResponse = await result.current;
		expect(finalResponse).toEqual({
			selectedOption: null,
			error: 'User not connected',
		});
	});
});
