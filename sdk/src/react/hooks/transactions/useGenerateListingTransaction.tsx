import { useMutation } from '@tanstack/react-query';
import { useConfig } from '../config/useConfig';

export type UseGenerateListingTransactionArgs = {
	chainId: number;
	onSuccess?: (data?: Step[]) => void;
};

import type * as types from '../../../types';
import { dateToUnixTime } from '../../../utils/date';
import {
	type CreateReq,
	type GenerateListingTransactionArgs,
	getMarketplaceClient,
	type Step,
} from '../../_internal';

export type CreateReqWithDateExpiry = Omit<CreateReq, 'expiry'> & {
	expiry: Date;
};

export type GenerateListingTransactionProps = Omit<
	GenerateListingTransactionArgs,
	'listing'
> & {
	listing: CreateReqWithDateExpiry;
};

type GenerateListingTransactionArgsWithNumberChainId = Omit<
	GenerateListingTransactionArgs,
	'chainId' | 'listing'
> & {
	chainId: number;
	listing: CreateReqWithDateExpiry;
};

export const generateListingTransaction = async (
	params: GenerateListingTransactionArgsWithNumberChainId,
	config: types.SdkConfig,
) => {
	const args = {
		...params,
		chainId: String(params.chainId),
		listing: {
			...params.listing,
			expiry: dateToUnixTime(params.listing.expiry),
		},
	} satisfies GenerateListingTransactionArgs;
	const marketplaceClient = getMarketplaceClient(config);
	return (await marketplaceClient.generateListingTransaction(args)).steps;
};

/**
 * Generates transaction steps for creating a marketplace listing
 *
 * This hook creates a mutation that calls the marketplace API to generate
 * the necessary transaction steps for listing an NFT. It handles date conversion
 * for expiry times and returns executable steps for the listing process.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The blockchain network ID for the listing
 * @param params.onSuccess - Optional callback when generation succeeds
 *
 * @returns Mutation object with listing transaction generation functions
 * @returns returns.generateListingTransaction - Mutation function (returns void)
 * @returns returns.generateListingTransactionAsync - Async mutation function (returns promise)
 * @returns returns.isLoading - True while generating transaction steps
 * @returns returns.error - Error object if generation fails
 * @returns returns.data - The generated transaction steps when successful
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { generateListingTransactionAsync } = useGenerateListingTransaction({
 *   chainId: 137
 * });
 *
 * const steps = await generateListingTransactionAsync({
 *   walletAddress: '0x...',
 *   listing: {
 *     tokenContract: '0x...',
 *     tokenId: '123',
 *     quantity: '1',
 *     pricePerToken: '1000000000000000000', // 1 ETH in wei
 *     currency: '0x...', // Currency contract address
 *     expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
 *   }
 * });
 * ```
 *
 * @example
 * With marketplace fees:
 * ```typescript
 * const { generateListingTransaction, isLoading } = useGenerateListingTransaction({
 *   chainId: 1,
 *   onSuccess: (steps) => {
 *     console.log('Ready to create listing with steps:', steps);
 *     executeSteps(steps);
 *   }
 * });
 *
 * generateListingTransaction({
 *   walletAddress: account.address,
 *   listing: {
 *     tokenContract: nftContract,
 *     tokenId: tokenId,
 *     quantity: '1',
 *     pricePerToken: ethers.parseEther('0.5').toString(),
 *     currency: WETH_ADDRESS,
 *     expiry: new Date('2024-12-31'),
 *     marketplace: {
 *       typeId: MarketplaceKind.sequence_marketplace_v2,
 *       fee: 250 // 2.5% fee
 *     }
 *   }
 * });
 * ```
 *
 * @remarks
 * - Automatically converts JavaScript Date objects to Unix timestamps
 * - The listing expiry date must be a future date
 * - Price should be provided in the smallest unit of the currency (wei for ETH)
 * - Steps may include approval transactions before the actual listing
 * - The chainId is fixed at hook initialization and applied to all mutations
 *
 * @see {@link CreateReqWithDateExpiry} - The listing object structure with Date expiry
 * @see {@link useProcessStep} - For executing the generated steps
 * @see {@link Step} - The step object structure returned
 */
export const useGenerateListingTransaction = (
	params: UseGenerateListingTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (
			args: Omit<GenerateListingTransactionArgsWithNumberChainId, 'chainId'>,
		) =>
			generateListingTransaction({ ...args, chainId: params.chainId }, config),
	});

	return {
		...result,
		generateListingTransaction: mutate,
		generateListingTransactionAsync: mutateAsync,
	};
};
