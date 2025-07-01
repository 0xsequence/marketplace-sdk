import { HttpResponse, http } from 'msw';
import type {
	FeeOption,
	FeeOptionExtended,
} from '../../../../types/waas-types';

// Mock fee options for different networks
export const mockFeeOptionsMainnet: FeeOption[] = [
	{
		gasLimit: 21000,
		to: '0xfee1234567890123456789012345678901234567890',
		token: {
			chainId: 1,
			contractAddress: null, // Native ETH
			decimals: 18,
			logoURL: 'https://assets.sequence.info/images/networks/mainnet.webp',
			name: 'Ethereum',
			symbol: 'ETH',
			tokenID: null,
			type: 'native',
		},
		value: '1000000000000000', // 0.001 ETH
	},
	{
		gasLimit: 21000,
		to: '0xfee1234567890123456789012345678901234567890',
		token: {
			chainId: 1,
			contractAddress: '0xa0b86a33e6b8b3b3b3b3b3b3b3b3b3b3b3b3b3b3',
			decimals: 6,
			logoURL: 'https://assets.sequence.info/images/tokens/usdc.webp',
			name: 'USD Coin',
			symbol: 'USDC',
			tokenID: null,
			type: 'ERC20',
		},
		value: '2000000', // 2 USDC
	},
];

export const mockFeeOptionsPolygon: FeeOption[] = [
	{
		gasLimit: 21000,
		to: '0xfee1234567890123456789012345678901234567890',
		token: {
			chainId: 137,
			contractAddress: null, // Native MATIC
			decimals: 18,
			logoURL: 'https://assets.sequence.info/images/networks/polygon.webp',
			name: 'Polygon',
			symbol: 'MATIC',
			tokenID: null,
			type: 'native',
		},
		value: '10000000000000000', // 0.01 MATIC
	},
	{
		gasLimit: 21000,
		to: '0xfee1234567890123456789012345678901234567890',
		token: {
			chainId: 137,
			contractAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
			decimals: 6,
			logoURL: 'https://assets.sequence.info/images/tokens/usdc.webp',
			name: 'USD Coin (PoS)',
			symbol: 'USDC',
			tokenID: null,
			type: 'ERC20',
		},
		value: '2000000', // 2 USDC
	},
];

export const mockFeeOptionsArbitrum: FeeOption[] = [
	{
		gasLimit: 21000,
		to: '0xfee1234567890123456789012345678901234567890',
		token: {
			chainId: 42161,
			contractAddress: null, // Native ETH
			decimals: 18,
			logoURL: 'https://assets.sequence.info/images/networks/arbitrum.webp',
			name: 'Ethereum',
			symbol: 'ETH',
			tokenID: null,
			type: 'native',
		},
		value: '500000000000000', // 0.0005 ETH (cheaper on Arbitrum)
	},
];

// Extended fee options with balance information
export const mockFeeOptionsExtended: FeeOptionExtended[] =
	mockFeeOptionsMainnet.map((option, index) => ({
		...option,
		balance: index === 0 ? '5000000000000000000' : '10000000', // 5 ETH or 10 USDC
		balanceFormatted: index === 0 ? '5.0' : '10.0',
		hasEnoughBalanceForFee: true,
	}));

// Mock fee options with insufficient balance
export const mockFeeOptionsInsufficientBalance: FeeOptionExtended[] =
	mockFeeOptionsMainnet.map((option, index) => ({
		...option,
		balance: index === 0 ? '500000000000000' : '1000000', // 0.0005 ETH or 1 USDC (insufficient)
		balanceFormatted: index === 0 ? '0.0005' : '1.0',
		hasEnoughBalanceForFee: false,
	}));

// Empty fee options for testnets (sponsored transactions)
export const mockFeeOptionsTestnet: FeeOption[] = [];

// Helper function to get fee options based on chain ID
export const getFeeOptionsByChainId = (chainId: number): FeeOption[] => {
	switch (chainId) {
		case 1: // Ethereum Mainnet
			return mockFeeOptionsMainnet;
		case 137: // Polygon
			return mockFeeOptionsPolygon;
		case 42161: // Arbitrum
			return mockFeeOptionsArbitrum;
		case 11155111: // Sepolia Testnet
		case 80001: // Mumbai Testnet
		case 421614: // Arbitrum Sepolia
			return mockFeeOptionsTestnet;
		default:
			return mockFeeOptionsMainnet;
	}
};

// MSW handlers for WaaS fee options
export const waasHandlers = [
	// GET fee options for a specific chain
	http.get('*/rpc/WaaS/GetFeeOptions/:chainId', ({ params }) => {
		const chainId = Number(params.chainId);
		const feeOptions = getFeeOptionsByChainId(chainId);

		return HttpResponse.json({
			feeOptions,
		});
	}),

	// GET fee options with balance information
	http.post('*/rpc/WaaS/GetFeeOptionsWithBalance', async ({ request }) => {
		const body = (await request.json()) as {
			chainId: number;
			walletAddress: string;
			includeBalance?: boolean;
		};

		const { chainId, includeBalance = true } = body;

		if (!includeBalance) {
			const feeOptions = getFeeOptionsByChainId(chainId);
			return HttpResponse.json({ feeOptions });
		}

		// Return extended fee options with balance info
		const baseFeeOptions = getFeeOptionsByChainId(chainId);
		const feeOptionsWithBalance: FeeOptionExtended[] = baseFeeOptions.map(
			(option, index) => ({
				...option,
				balance: index === 0 ? '5000000000000000000' : '10000000', // 5 ETH or 10 USDC
				balanceFormatted: index === 0 ? '5.0' : '10.0',
				hasEnoughBalanceForFee: true,
			}),
		);

		return HttpResponse.json({
			feeOptions: feeOptionsWithBalance,
		});
	}),

	// POST fee option selection confirmation
	http.post('*/rpc/WaaS/ConfirmFeeOption', async ({ request }) => {
		const body = (await request.json()) as {
			feeOptionId: string;
			chainId: number;
			transactionId?: string;
		};

		return HttpResponse.json({
			success: true,
			confirmationId: `confirmation-${Date.now()}`,
			feeOptionId: body.feeOptionId,
		});
	}),

	// GET sponsored transaction status (for testnets)
	http.get(
		'*/rpc/WaaS/GetSponsoredTransactionStatus/:chainId',
		({ params }) => {
			const chainId = Number(params.chainId);
			const isTestnet = [11155111, 80001, 421614].includes(chainId);

			return HttpResponse.json({
				isSponsored: isTestnet,
				sponsorshipAvailable: isTestnet,
				reason: isTestnet
					? 'Testnet transactions are sponsored'
					: 'Mainnet requires fee payment',
			});
		},
	),
];

// Error handlers for testing error scenarios
export const waasErrorHandlers = [
	// Simulate fee options loading error
	http.get('*/rpc/WaaS/GetFeeOptions/999999', () => {
		return HttpResponse.json({ error: 'Unsupported network' }, { status: 400 });
	}),

	// Simulate insufficient balance error
	http.post('*/rpc/WaaS/GetFeeOptionsWithBalance', async ({ request }) => {
		const body = (await request.json()) as {
			chainId: number;
			simulateInsufficientBalance?: boolean;
		};

		if (body.simulateInsufficientBalance) {
			return HttpResponse.json({
				feeOptions: mockFeeOptionsInsufficientBalance,
			});
		}

		// Default to normal response
		const feeOptions = getFeeOptionsByChainId(body.chainId);
		return HttpResponse.json({ feeOptions });
	}),

	// Simulate fee confirmation error
	http.post('*/rpc/WaaS/ConfirmFeeOption', () => {
		return HttpResponse.json(
			{ error: 'Fee confirmation failed' },
			{ status: 500 },
		);
	}),
];

// Export all handlers
export const allWaasHandlers = [...waasHandlers, ...waasErrorHandlers];
