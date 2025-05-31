import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { getMarketplaceClient } from '../_internal';
import type {
	GenerateCancelTransactionArgs,
	Step,
} from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';

/**
 * Arguments for the useGenerateCancelTransaction hook
 */
export interface UseGenerateCancelTransactionArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** Optional callback function called when the transaction generation succeeds */
	onSuccess?: (steps?: Step[]) => void;
}

export const generateCancelTransaction = async (
	args: GenerateCancelTransactionArgs,
	config: SdkConfig,
	chainId: number,
) => {
	const marketplaceClient = getMarketplaceClient(chainId, config);
	return marketplaceClient
		.generateCancelTransaction(args)
		.then((data) => data.steps);
};

/**
 * Hook to generate a cancel transaction for an existing order
 *
 * Creates the necessary transaction steps to cancel an active listing or offer
 * on the marketplace. Returns a mutation hook that can be triggered to generate
 * the cancel transaction data.
 *
 * @param params - Configuration object containing chain ID and optional success callback
 * @returns Mutation hook with functions to generate cancel transactions
 *
 * @example
 * ```tsx
 * const { generateCancelTransaction, isPending, error } = useGenerateCancelTransaction({
 *   chainId: 137,
 *   onSuccess: (steps) => {
 *     console.log('Cancel transaction generated with', steps?.length, 'steps');
 *   }
 * });
 *
 * const handleCancel = () => {
 *   generateCancelTransaction({
 *     collectionAddress: '0x...',
 *     maker: '0x...', // Address of the order creator
 *     marketplace: MarketplaceKind.opensea,
 *     orderId: 'order-123'
 *   });
 * };
 *
 * return (
 *   <button onClick={handleCancel} disabled={isPending}>
 *     {isPending ? 'Generating...' : 'Cancel Order'}
 *   </button>
 * );
 * ```
 */
export const useGenerateCancelTransaction = (
	params: UseGenerateCancelTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateCancelTransactionArgs) =>
			generateCancelTransaction(args, config, params.chainId),
	});

	return {
		...result,
		generateCancelTransaction: mutate,
		generateCancelTransactionAsync: mutateAsync,
	};
};
