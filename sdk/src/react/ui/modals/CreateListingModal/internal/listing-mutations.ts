import {
	type Address,
	type ContractType,
	type CreateReq,
	type GenerateListingTransactionRequest,
	type Step,
	StepType,
} from '@0xsequence/api-client';
import { useMutation } from '@tanstack/react-query';
import { toNumber } from 'dnum';
import { useMemo } from 'react';
import type { Hex } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { OrderbookKind } from '../../../../../types';
import { getConduitAddressForOrderbook } from '../../../../../utils/getConduitAddressForOrderbook';
import { getSequenceMarketplaceRequestId } from '../../../../../utils/getSequenceMarketRequestId';
import { getMarketplaceClient, TransactionType } from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import {
	useConfig,
	useConnectorMetadata,
	useCurrency,
	useProcessStep,
} from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { fromBigIntString } from '../../_internal/helpers/dnum-utils';
import { useCollectibleApproval } from './hooks/use-collectible-approval';
import { useCreateListingModalState } from './store';

export type ProcessStepResult =
	| { type: 'transaction'; hash: Hex }
	| { type: 'signature'; orderId?: string; signature?: Hex };

export interface ListingParams {
	tokenId: bigint;
	quantity: bigint;
	expiry: string;
	currencyAddress: Address;
	pricePerToken: bigint;
}

export interface UseListingMutationsArgs {
	chainId: number;
	collectionAddress: Address;
	contractType: ContractType | undefined;
	orderbookKind: OrderbookKind | undefined;
	listing: ListingParams;
	currencyDecimals: number;
	// NFT approval check should be independent of form validation
	nftApprovalEnabled?: boolean;
}

export const useListingMutations = ({
	chainId,
	collectionAddress,
	contractType,
	orderbookKind,
	listing,
	currencyDecimals,
	nftApprovalEnabled = true,
}: UseListingMutationsArgs) => {
	const sdkConfig = useConfig();
	const { address: ownerAddress } = useAccount();
	const publicClient = usePublicClient();
	const { show: showTxModal } = useTransactionStatusModal();
	const analytics = useAnalytics();
	const state = useCreateListingModalState();
	const { processStep } = useProcessStep();
	const { walletKind, isSequence } = useConnectorMetadata();
	const canBeBundled =
		isSequence && orderbookKind === OrderbookKind.sequence_marketplace_v2;
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: listing.currencyAddress,
	});

	async function executeStepAndWait(step: Step) {
		const res = await processStep(step, chainId);
		if (res.type === 'transaction' && res.hash) {
			await waitForTransactionReceipt({
				txHash: res.hash,
				chainId,
				sdkConfig,
			});
		}
		return res;
	}

	async function generateListingSteps(): Promise<Step[]> {
		if (!contractType) {
			throw new Error('Contract type is required to generate listing steps');
		}
		if (!ownerAddress) {
			throw new Error('Wallet not connected');
		}
		if (!orderbookKind) {
			throw new Error('Orderbook kind is required');
		}

		const marketplaceClient = getMarketplaceClient(sdkConfig);

		const request: GenerateListingTransactionRequest = {
			chainId,
			collectionAddress,
			owner: ownerAddress,
			walletType: walletKind,
			contractType,
			orderbook: orderbookKind,
			listing: {
				tokenId: listing.tokenId,
				quantity: listing.quantity,
				expiry: listing.expiry,
				currencyAddress: listing.currencyAddress,
				pricePerToken: listing.pricePerToken,
			} satisfies CreateReq,
			additionalFees: [],
		};

		const response =
			await marketplaceClient.generateListingTransaction(request);
		const steps = response.steps;

		if (steps.length === 0) {
			throw new Error('No steps generated');
		}

		return steps;
	}

	const spenderAddress = getConduitAddressForOrderbook(orderbookKind);

	const collectibleApprovalQuery = useCollectibleApproval({
		collectionAddress,
		spenderAddress,
		chainId,
		contractType,
		enabled:
			nftApprovalEnabled &&
			!canBeBundled &&
			!!ownerAddress &&
			!!contractType &&
			!!orderbookKind &&
			!!spenderAddress,
	});

	const needsApproval = useMemo(() => {
		if (canBeBundled) return false;
		if (collectibleApprovalQuery.isApproved === undefined) return true;

		return !collectibleApprovalQuery.isApproved;
	}, [collectibleApprovalQuery.isApproved, canBeBundled]);

	const approve = useMutation({
		mutationFn: async () => {
			// Generate listing steps to extract approval step
			const steps = await generateListingSteps();
			const approvalStep = steps.find(
				(step) => step.id === StepType.tokenApproval,
			);

			if (!approvalStep) {
				throw new Error('No approval step found');
			}

			const result = await executeStepAndWait(approvalStep);
			return result;
		},
	});

	const createListing = useMutation({
		mutationFn: async () => {
			// Generate steps via API only when user clicks Create Listing
			const steps = await generateListingSteps();

			// Filter out approval step if it exists (we handle it separately)
			const listingSteps = steps.filter(
				(step) => step.id !== StepType.tokenApproval,
			);

			if (listingSteps.length === 0) {
				throw new Error('No listing steps found');
			}

			// Execute all listing steps
			let hash: Hex | undefined;
			let orderId: string | undefined;

			for (const step of listingSteps) {
				const res = await executeStepAndWait(step);
				if (res.type === 'transaction') {
					hash = res.hash;
				} else if (res.type === 'signature') {
					orderId = res.orderId;
				}
			}

			if (currency && ownerAddress) {
				const currencyValueRaw = Number(listing.pricePerToken.toString());
				const priceDnum = fromBigIntString(
					listing.pricePerToken.toString(),
					currencyDecimals,
				);
				const currencyValueDecimal = toNumber(priceDnum);

				let requestId: string | undefined = orderId;

				if (
					hash &&
					(orderbookKind === OrderbookKind.sequence_marketplace_v1 ||
						orderbookKind === OrderbookKind.sequence_marketplace_v2) &&
					publicClient
				) {
					requestId = await getSequenceMarketplaceRequestId(
						hash,
						publicClient,
						ownerAddress,
					);
				}

				analytics.trackCreateListing({
					props: {
						orderbookKind:
							orderbookKind || OrderbookKind.sequence_marketplace_v2,
						collectionAddress,
						currencyAddress: listing.currencyAddress,
						currencySymbol: currency.symbol || '',
						tokenId: listing.tokenId.toString(),
						requestId: requestId || '',
						chainId: chainId.toString(),
						txnHash: hash || '',
					},
					nums: {
						currencyValueDecimal,
						currencyValueRaw,
					},
				});
			}

			return { hash, orderId };
		},
		onSuccess: (res) => {
			state.closeModal();
			showTxModal({
				type: TransactionType.LISTING,
				chainId,
				hash: res.hash,
				orderId: res.orderId,
				collectionAddress,
				tokenId: state.tokenId,
				queriesToInvalidate: [
					['collectible', 'market-lowest-listing'],
					['collectible', 'market-listings'],
					['collectible', 'market-count-listings'],
					['token', 'balances'],
				],
			});
		},
	});

	return {
		approve,
		createListing,
		needsApproval,
		nftApprovalQuery: collectibleApprovalQuery,
	};
};
