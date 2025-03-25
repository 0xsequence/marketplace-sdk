import { useChain } from '@0xsequence/connect';
import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import {
	mockIndexerEndpoint,
	mockIndexerHandler,
	mockTokenBalance,
} from '../../_internal/api/__mocks__/indexer.msw';
import type { FeeOption } from '../../ui/modals/_internal/components/waasFeeOptionsSelect/WaasFeeOptionsSelect';
import { useAutoSelectFeeOption } from '../useAutoSelectFeeOption';

// Mock wagmi hooks
vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(),
	};
});

// Mock @0xsequence/connect
vi.mock('@0xsequence/connect', () => ({
	useChain: vi.fn(),
}));

describe('useAutoSelectFeeOption', () => {
	const mockUserAddress = '0x1234567890123456789012345678901234567890';
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
		// Mock useAccount hook with complete wagmi account type
		vi.mocked(useAccount).mockReturnValue({
			address: mockUserAddress as `0x${string}`,
			addresses: [mockUserAddress as `0x${string}`],
			chain: mainnet,
			chainId: mockChainId,
			connector: undefined,
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: true,
			status: 'reconnecting',
		});

		// Mock useChain hook with required chain properties
		vi.mocked(useChain).mockReturnValue({
			...mainnet,
			id: mockChainId,
			name: 'Ethereum',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
		});

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
		await waitFor(async () => {
			const response = await result.current;
			expect(response.selectedOption).toBe(mockFeeOptions[0]);
		});

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

	it('should return UserNotConnected error when wallet is not connected', async () => {
		// Mock useAccount to return no address (user not connected)
		vi.mocked(useAccount).mockReturnValue({
			address: undefined,
			addresses: [],
			chain: mainnet,
			chainId: mockChainId,
			connector: undefined,
			isConnected: false,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: true,
			status: 'reconnecting',
		});

		const { result } = renderHook(() => useAutoSelectFeeOption(defaultArgs));

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
});
