import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types/index';
import {
	type GenerateSellTransactionArgs,
	getMarketplaceClient,
} from '../../_internal';
import type { Step } from '../../_internal/api/marketplace.gen';
import { useConfig } from '../config/useConfig';

interface UseGenerateSellTransactionArgs {
	chainId: number;
	onSuccess?: (steps?: Step[]) => void;
}

type GenerateSellTransactionArgsWithNumberChainId = Omit<
	GenerateSellTransactionArgs,
	'chainId'
> & { chainId: number };

export const generateSellTransaction = async (
	args: GenerateSellTransactionArgsWithNumberChainId,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	const argsWithStringChainId = {
		...args,
		chainId: String(args.chainId),
	} satisfies GenerateSellTransactionArgs;
	return marketplaceClient
		.generateSellTransaction(argsWithStringChainId)
		.then((data) => data.steps);
};

/**
 * Generates transaction steps for selling a collectible (accepting an offer or buying a listing)
 *
 * This hook creates a mutation that calls the marketplace API to generate
 * the necessary transaction steps for completing a sale. This includes both
 * accepting offers on your collectibles and buying collectibles from existing listings.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The blockchain network ID for the transaction
 * @param params.onSuccess - Optional callback when generation succeeds
 *
 * @returns Mutation object with sell transaction generation functions
 * @returns returns.generateSellTransaction - Mutation function (returns void)
 * @returns returns.generateSellTransactionAsync - Async mutation function (returns promise)
 * @returns returns.isLoading - True while generating transaction steps
 * @returns returns.error - Error object if generation fails
 * @returns returns.data - The generated transaction steps when successful
 *
 * @example
 * Accepting an offer:
 * ```typescript
 * const { generateSellTransactionAsync } = useGenerateSellTransaction({
 *   chainId: 137
 * });
 *
 * const steps = await generateSellTransactionAsync({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   seller: '0x...',
 *   marketplace: MarketplaceKind.sequence_marketplace_v2,
 *   ordersData: [
 *     {
 *       orderId: 'offer-123',
 *       quantity: '1'
 *     }
 *   ],
 *   additionalFees: [
 *     {
 *       amount: '1000000000000000000', // 1 ETH in wei
 *       receiver: '0x...' // Platform fee receiver address
 *     }
 *   ]
 *   walletType: WalletKind.sequence,
 * });
 * ```
 *
 * @example
 * Buying from a listing:
 * ```typescript
 * const { generateSellTransaction, isLoading } = useGenerateSellTransaction({
 *   chainId: 1,
 *   onSuccess: (steps) => {
 *     console.log('Purchase steps ready:', steps);
 *     executeSteps(steps);
 *   }
 * });
 *
 * generateSellTransaction({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   seller: '0x...',
 *   marketplace: MarketplaceKind.sequence_marketplace_v2,
 *   ordersData: [
 *     {
 *       orderId: 'listing-123',
 *       quantity: '2'
 *     }
 *   ],
 *   additionalFees: [
 *     {
 *       amount: '1000000000000000000', // 1 ETH in wei
 *       receiver: '0x...' // Platform fee receiver address
 *     }
 *   ],
 *   walletType: WalletKind.sequence,
 * });
 * ```
 *
 * @remarks
 * - Used for both accepting offers (as seller) and buying listings (as buyer)
 * - The `orderId` can be either an offer ID or listing ID
 * - Steps may include approval transactions before the sale
 * - For partial fills, use `fillQuantity` less than the total order quantity
 * - The `recipient` parameter allows purchasing collectibles for another address
 *
 * @see {@link useProcessStep} - For executing the generated steps
 * @see {@link MarketplaceKind} - Supported marketplace types
 * @see {@link Step} - The step object structure returned
 */
export const useGenerateSellTransaction = (
	params: UseGenerateSellTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (
			args: Omit<GenerateSellTransactionArgsWithNumberChainId, 'chainId'>,
		) => generateSellTransaction({ ...args, chainId: params.chainId }, config),
	});

	return {
		...result,
		generateSellTransaction: mutate,
		generateSellTransactionAsync: mutateAsync,
	};
};
