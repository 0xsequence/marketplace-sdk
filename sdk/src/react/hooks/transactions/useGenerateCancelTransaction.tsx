import { useMutation } from '@tanstack/react-query';
import type * as types from '../../../types';
import {
	type GenerateCancelTransactionArgs,
	getMarketplaceClient,
} from '../../_internal';
import type { Step } from '../../_internal/api/marketplace.gen';
import { useConfig } from '../config/useConfig';

// Create a type that uses number for chainId
type GenerateCancelTransactionArgsWithNumberChainId = Omit<
	GenerateCancelTransactionArgs,
	'chainId'
> & {
	chainId: number;
};

interface UseGenerateCancelTransactionArgs {
	chainId: number;
	onSuccess?: (steps?: Step[]) => void;
}

export const generateCancelTransaction = async (
	args: GenerateCancelTransactionArgsWithNumberChainId,
	config: types.SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient
		.generateCancelTransaction({ ...args, chainId: String(args.chainId) })
		.then((data) => data.steps);
};

/**
 * Generates transaction steps for cancelling a marketplace order
 *
 * This hook creates a mutation that calls the marketplace API to generate
 * the necessary transaction or signature steps for cancelling an order.
 * The returned steps can then be executed to complete the cancellation.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The blockchain network ID where the order exists
 * @param params.onSuccess - Optional callback when generation succeeds
 *
 * @returns Mutation object with cancel transaction generation functions
 * @returns returns.generateCancelTransaction - Mutation function (returns void)
 * @returns returns.generateCancelTransactionAsync - Async mutation function (returns promise)
 * @returns returns.isLoading - True while generating transaction steps
 * @returns returns.error - Error object if generation fails
 * @returns returns.data - The generated transaction steps when successful
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { generateCancelTransactionAsync } = useGenerateCancelTransaction({
 *   chainId: 137
 * });
 *
 * const steps = await generateCancelTransactionAsync({
 *   walletAddress: '0x...',
 *   orderId: '123',
 *   marketplace: MarketplaceKind.sequence_marketplace_v2
 * });
 *
 * console.log('Generated steps:', steps);
 * ```
 *
 * @example
 * With success callback:
 * ```typescript
 * const { generateCancelTransaction, isLoading } = useGenerateCancelTransaction({
 *   chainId: 1,
 *   onSuccess: (steps) => {
 *     console.log(`Generated ${steps?.length} steps for cancellation`);
 *     // Process the steps...
 *   }
 * });
 *
 * // Trigger generation
 * generateCancelTransaction({
 *   walletAddress: account.address,
 *   orderId: orderToCancel,
 *   marketplace: MarketplaceKind.sequence_marketplace_v1
 * });
 * ```
 *
 * @remarks
 * - Uses React Query's `useMutation` for the API call
 * - The chainId from params is converted to string for the API
 * - Steps may include transaction execution or message signing
 * - Each step contains the necessary data to execute the cancellation
 *
 * @see {@link useCancelTransactionSteps} - Uses this hook to generate steps
 * @see {@link useProcessStep} - Executes the generated steps
 * @see {@link Step} - The step object structure returned
 */
export const useGenerateCancelTransaction = (
	params: UseGenerateCancelTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateCancelTransactionArgsWithNumberChainId) =>
			generateCancelTransaction(args, config),
	});

	return {
		...result,
		generateCancelTransaction: mutate,
		generateCancelTransactionAsync: mutateAsync,
	};
};
