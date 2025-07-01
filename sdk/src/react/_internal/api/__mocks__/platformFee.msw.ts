import { HttpResponse, http } from 'msw';
import { avalanche, optimism } from 'viem/chains';
import type { AdditionalFee } from '../marketplace.gen';

// Platform fee recipients
export const DEFAULT_PLATFORM_FEE_RECIPIENT =
	'0x858dB1cbF6D09D447C96A11603189b49B2D1C219';
export const AVALANCHE_OPTIMISM_PLATFORM_FEE_RECIPIENT =
	'0x400cdab4676c17aec07e8ec748a5fc3b674bca41';

// Default platform fee percentage
export const DEFAULT_PLATFORM_FEE_PERCENTAGE = 2.5;

// Mock platform fee configurations for different collections
const mockPlatformFeeConfigs: Record<
	string,
	{
		chainId: number;
		feePercentage: number;
		recipient: string;
	}
> = {
	// Standard collections
	'0x1234567890123456789012345678901234567890': {
		chainId: 1,
		feePercentage: 2.5,
		recipient: DEFAULT_PLATFORM_FEE_RECIPIENT,
	},
	// High-value collection with lower fees
	'0x9876543210987654321098765432109876543210': {
		chainId: 1,
		feePercentage: 1.0,
		recipient: DEFAULT_PLATFORM_FEE_RECIPIENT,
	},
	// Polygon collection
	'0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef': {
		chainId: 137,
		feePercentage: 2.5,
		recipient: DEFAULT_PLATFORM_FEE_RECIPIENT,
	},
	// Avalanche collection (different recipient)
	'0xavalanche1234567890123456789012345678901234': {
		chainId: avalanche.id,
		feePercentage: 2.0,
		recipient: AVALANCHE_OPTIMISM_PLATFORM_FEE_RECIPIENT,
	},
	// Optimism collection (different recipient)
	'0xoptimism1234567890123456789012345678901234': {
		chainId: optimism.id,
		feePercentage: 2.0,
		recipient: AVALANCHE_OPTIMISM_PLATFORM_FEE_RECIPIENT,
	},
};

// Helper function to calculate BPS from percentage
const percentageToBPS = (percentage: number): string => {
	return ((percentage * 10000) / 100).toString();
};

// Helper function to get platform fee for a collection
export const getPlatformFeeForCollection = (
	chainId: number,
	collectionAddress: string,
): AdditionalFee => {
	const config = mockPlatformFeeConfigs[collectionAddress.toLowerCase()];

	if (config && config.chainId === chainId) {
		return {
			amount: percentageToBPS(config.feePercentage),
			receiver: config.recipient,
		};
	}

	// Default fee configuration
	const isAvalancheOrOptimism =
		chainId === avalanche.id || chainId === optimism.id;
	const recipient = isAvalancheOrOptimism
		? AVALANCHE_OPTIMISM_PLATFORM_FEE_RECIPIENT
		: DEFAULT_PLATFORM_FEE_RECIPIENT;

	return {
		amount: percentageToBPS(DEFAULT_PLATFORM_FEE_PERCENTAGE),
		receiver: recipient,
	};
};

// MSW handlers for platform fees
export const platformFeeHandlers = [
	// GET platform fee for a specific collection
	http.get(
		'*/rpc/PlatformFee/GetFee/:chainId/:collectionAddress',
		({ params }) => {
			const chainId = Number(params.chainId);
			const collectionAddress = params.collectionAddress as string;

			const fee = getPlatformFeeForCollection(chainId, collectionAddress);

			return HttpResponse.json({
				chainId,
				collectionAddress,
				feePercentage: Number(fee.amount) / 100, // Convert BPS back to percentage
				feeBPS: Number(fee.amount),
				recipient: fee.receiver,
			});
		},
	),

	// GET platform fee configuration for multiple collections
	http.post('*/rpc/PlatformFee/GetFeesForCollections', async ({ request }) => {
		const body = (await request.json()) as {
			collections: Array<{ chainId: number; collectionAddress: string }>;
		};

		const fees = body.collections.map(({ chainId, collectionAddress }) => {
			const fee = getPlatformFeeForCollection(chainId, collectionAddress);
			return {
				chainId,
				collectionAddress,
				feePercentage: Number(fee.amount) / 100,
				feeBPS: Number(fee.amount),
				recipient: fee.receiver,
			};
		});

		return HttpResponse.json({
			fees,
		});
	}),

	// GET default platform fee for a chain
	http.get('*/rpc/PlatformFee/GetDefaultFee/:chainId', ({ params }) => {
		const chainId = Number(params.chainId);
		const isAvalancheOrOptimism =
			chainId === avalanche.id || chainId === optimism.id;

		const feePercentage = isAvalancheOrOptimism
			? 2.0
			: DEFAULT_PLATFORM_FEE_PERCENTAGE;
		const recipient = isAvalancheOrOptimism
			? AVALANCHE_OPTIMISM_PLATFORM_FEE_RECIPIENT
			: DEFAULT_PLATFORM_FEE_RECIPIENT;

		return HttpResponse.json({
			chainId,
			feePercentage,
			feeBPS: percentageToBPS(feePercentage),
			recipient,
		});
	}),

	// POST update platform fee (for testing admin scenarios)
	http.post('*/rpc/PlatformFee/UpdateFee', async ({ request }) => {
		const body = (await request.json()) as {
			chainId: number;
			collectionAddress: string;
			feePercentage: number;
			recipient?: string;
		};

		// In a real implementation, this would update the database
		// For testing, we just return success
		return HttpResponse.json({
			success: true,
			chainId: body.chainId,
			collectionAddress: body.collectionAddress,
			feePercentage: body.feePercentage,
			feeBPS: percentageToBPS(body.feePercentage),
			recipient: body.recipient || DEFAULT_PLATFORM_FEE_RECIPIENT,
		});
	}),
];

// Error handlers for testing error scenarios
export const platformFeeErrorHandlers = [
	// Simulate fee configuration not found
	http.get('*/rpc/PlatformFee/GetFee/999999/*', () => {
		return HttpResponse.json({ error: 'Chain not supported' }, { status: 404 });
	}),

	// Simulate invalid collection address
	http.get('*/rpc/PlatformFee/GetFee/*/0xinvalid', () => {
		return HttpResponse.json(
			{ error: 'Invalid collection address' },
			{ status: 400 },
		);
	}),

	// Simulate server error
	http.post('*/rpc/PlatformFee/UpdateFee', () => {
		return HttpResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}),
];

// Export all handlers
export const allPlatformFeeHandlers = [
	...platformFeeHandlers,
	...platformFeeErrorHandlers,
];

// Export mock data for use in tests
export { mockPlatformFeeConfigs, percentageToBPS };
