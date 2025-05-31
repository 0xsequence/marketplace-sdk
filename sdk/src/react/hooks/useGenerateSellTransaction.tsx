import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { getMarketplaceClient } from '../_internal';
import type {
	GenerateSellTransactionArgs,
	Step,
} from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';

/**
 * Arguments for the useGenerateSellTransaction hook
 */
export interface UseGenerateSellTransactionArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** Optional callback function called when the transaction generation succeeds */
	onSuccess?: (steps?: Step[]) => void;
}

export const generateSellTransaction = async (
	args: GenerateSellTransactionArgs,
	config: SdkConfig,
	chainId: number,
) => {
	const marketplaceClient = getMarketplaceClient(chainId, config);
	return marketplaceClient
		.generateSellTransaction(args)
		.then((data) => data.steps);
};

/**
 * Hook to generate a sell transaction for accepting offers on collectables
 *
 * Creates the necessary transaction steps to accept an offer and sell a collectable
 * on the marketplace. Returns a mutation hook that can be triggered to generate
 * the sell transaction data including any required approvals.
 *
 * @param params - Configuration object containing chain ID and optional success callback
 * @returns Mutation hook with functions to generate sell transactions
 *
 * @example
 * ```tsx
 * const { generateSellTransaction, isPending, error } = useGenerateSellTransaction({
 *   chainId: 137,
 *   onSuccess: (steps) => {
 *     console.log('Sell transaction generated with', steps?.length, 'steps');
 *   }
 * });
 *
 * const handleAcceptOffer = () => {
 *   generateSellTransaction({
 *     collectionAddress: '0x...',
 *     seller: '0x...', // Address of the NFT owner
 *     marketplace: MarketplaceKind.opensea,
 *     ordersData: [{ orderId: 'offer-123', quantity: '1' }],
 *     additionalFees: []
 *   });
 * };
 *
 * return (
 *   <button onClick={handleAcceptOffer} disabled={isPending}>
 *     {isPending ? 'Generating...' : 'Accept Offer'}
 *   </button>
 * );
 * ```
 */
export const useGenerateSellTransaction = (
	params: UseGenerateSellTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateSellTransactionArgs) =>
			generateSellTransaction(args, config, params.chainId),
	});

	return {
		...result,
		generateSellTransaction: mutate,
		generateSellTransactionAsync: mutateAsync,
	};
};
