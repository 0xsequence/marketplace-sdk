import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import { dateToUnixTime } from '../../../utils/date';
import {
	type CreateReq,
	type GenerateOfferTransactionArgs,
	getMarketplaceClient,
	type Step,
	type WalletKind,
} from '../../_internal';
import { useConfig } from '../config/useConfig';
import { useConnectorMetadata } from '../config/useConnectorMetadata';

export type UseGenerateOfferTransactionArgs = {
	chainId: number;
	onSuccess?: (data?: Step[]) => void;
};

type CreateReqWithDateExpiry = Omit<CreateReq, 'expiry'> & {
	expiry: Date;
};

export type GenerateOfferTransactionProps = Omit<
	GenerateOfferTransactionArgs,
	'offer'
> & {
	offer: CreateReqWithDateExpiry;
};

type GenerateOfferTransactionArgsWithNumberChainId = Omit<
	GenerateOfferTransactionArgs,
	'chainId' | 'offer'
> & {
	chainId: number;
	offer: CreateReqWithDateExpiry;
};

export const generateOfferTransaction = async (
	params: GenerateOfferTransactionArgsWithNumberChainId,
	config: SdkConfig,
	walletKind?: WalletKind,
) => {
	const args = {
		...params,
		chainId: String(params.chainId),
		offer: { ...params.offer, expiry: dateToUnixTime(params.offer.expiry) },
		walletType: walletKind,
	} satisfies GenerateOfferTransactionArgs;
	const marketplaceClient = getMarketplaceClient(config);
	return (await marketplaceClient.generateOfferTransaction(args)).steps;
};

/**
 * Generates transaction steps for creating an offer on an NFT
 *
 * This hook creates a mutation that calls the marketplace API to generate
 * the necessary transaction steps for making an offer. It automatically detects
 * the connected wallet type and handles date conversion for offer expiry.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The blockchain network ID for the offer
 * @param params.onSuccess - Optional callback when generation succeeds
 *
 * @returns Mutation object with offer transaction generation functions
 * @returns returns.generateOfferTransaction - Mutation function (returns void)
 * @returns returns.generateOfferTransactionAsync - Async mutation function (returns promise)
 * @returns returns.isLoading - True while generating transaction steps
 * @returns returns.error - Error object if generation fails
 * @returns returns.data - The generated transaction steps when successful
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { generateOfferTransactionAsync } = useGenerateOfferTransaction({
 *   chainId: 137
 * });
 *
 * const steps = await generateOfferTransactionAsync({
 *   walletAddress: '0x...',
 *   offer: {
 *     tokenContract: '0x...',
 *     tokenId: '123',
 *     quantity: '1',
 *     pricePerToken: '500000000000000000', // 0.5 ETH in wei
 *     currency: '0x...', // Currency contract address
 *     expiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
 *   }
 * });
 * ```
 *
 * @example
 * Collection offer with criteria:
 * ```typescript
 * const { generateOfferTransaction, isLoading } = useGenerateOfferTransaction({
 *   chainId: 1,
 *   onSuccess: (steps) => {
 *     console.log('Offer steps generated:', steps);
 *     processSteps(steps);
 *   }
 * });
 *
 * // Make an offer on any token in the collection
 * generateOfferTransaction({
 *   walletAddress: account.address,
 *   offer: {
 *     tokenContract: collectionAddress,
 *     tokenId: '0', // Collection offer
 *     quantity: '1',
 *     pricePerToken: ethers.parseEther('1').toString(),
 *     currency: WETH_ADDRESS,
 *     expiry: new Date('2024-12-31'),
 *     criteria: {
 *       collection: {
 *         tokenContract: collectionAddress
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * @remarks
 * - Automatically detects and includes the wallet type (Sequence, WaaS, etc.)
 * - Converts JavaScript Date objects to Unix timestamps for the API
 * - For collection offers, use tokenId '0' with criteria
 * - Price should be in the smallest unit of the currency (wei for ETH/WETH)
 * - Steps may include currency approval before the offer transaction
 * - The wallet must have sufficient balance of the offer currency
 *
 * @see {@link CreateReqWithDateExpiry} - The offer object structure with Date expiry
 * @see {@link useConnectorMetadata} - Provides wallet type detection
 * @see {@link useProcessStep} - For executing the generated steps
 */
export const useGenerateOfferTransaction = (
	params: UseGenerateOfferTransactionArgs,
) => {
	const config = useConfig();
	const { walletKind } = useConnectorMetadata();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (
			args: Omit<GenerateOfferTransactionArgsWithNumberChainId, 'chainId'>,
		) =>
			generateOfferTransaction(
				{ ...args, chainId: params.chainId },
				config,
				walletKind,
			),
	});

	return {
		...result,
		generateOfferTransaction: mutate,
		generateOfferTransactionAsync: mutateAsync,
	};
};
