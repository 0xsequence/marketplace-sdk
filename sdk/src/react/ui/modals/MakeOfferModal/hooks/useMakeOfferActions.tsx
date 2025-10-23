'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Address } from 'viem';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { OrderbookKind, type Price } from '../../../../../types';
import { getSequenceMarketplaceRequestId } from '../../../../../utils/getSequenceMarketRequestId';
import {
	balanceQueries,
	type ContractType,
	collectableKeys,
} from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import { TransactionType } from '../../../../_internal/types';
import {
	useConfig,
	useConnectorMetadata,
	useGenerateOfferTransaction,
	useModalTransaction,
	useProcessStep,
} from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils/waitForTransactionReceipt';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
import type { ModalCallbacks } from '../../_internal/types';
import { makeOfferModalStore } from '../store';
import { useGetTokenApprovalData } from './useGetTokenApproval';

interface UseMakeOfferActionsProps {
	tokenId: string;
	collectionAddress: Address;
	chainId: number;
	callbacks?: ModalCallbacks;
	orderbookKind?: OrderbookKind;
	collectionType?: ContractType;
	collectibleDecimals?: number;
	offerPrice: Price;
	quantity: string;
	expiry: Date;
}

export const useMakeOfferActions = ({
	tokenId,
	collectionAddress,
	chainId,
	callbacks,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	collectionType,
	collectibleDecimals = 0,
	offerPrice,
	quantity,
	expiry,
}: UseMakeOfferActionsProps) => {
	const queryClient = useQueryClient();
	const { address } = useAccount();
	const publicClient = usePublicClient({ chainId });
	const { walletKind, isWaaS } = useConnectorMetadata();
	const sdkConfig = useConfig();
	const analytics = useAnalytics();
	const { processStep } = useProcessStep();
	const { isVisible: feeOptionsVisible } = useSelectWaasFeeOptionsStore();

	// ✅ Get token approval data - derived from query hook
	const {
		data: tokenApproval,
		isLoading: isCheckingApproval,
		error: approvalCheckError,
	} = useGetTokenApprovalData({
		chainId,
		tokenId,
		collectionAddress,
		currencyAddress: offerPrice.currency.contractAddress,
		contractType: collectionType!,
		orderbook: orderbookKind,
	});

	// ✅ Generate offer transaction hook
	const {
		generateOfferTransactionAsync,
		isPending: isGeneratingSteps,
		error: generateError,
	} = useGenerateOfferTransaction({ chainId });

	// ✅ Setup transaction hook for offer submission
	const transaction = useModalTransaction({
		chainId,
		transactionType: TransactionType.OFFER,
		callbacks,
		closeModal: () => makeOfferModalStore.send({ type: 'close' }),
		queriesToInvalidate: [
			balanceQueries.all,
			collectableKeys.highestOffers,
			collectableKeys.offers,
			collectableKeys.offersCount,
			collectableKeys.userBalances,
		],
		collectionAddress,
		collectibleId: tokenId,
	});

	// ✅ Generate offer steps - no useState, just async function
	const generateOfferSteps = async () => {
		if (!address || !collectionType) return [];

		const steps = await generateOfferTransactionAsync({
			collectionAddress,
			maker: address,
			walletType: walletKind,
			contractType: collectionType,
			orderbook: orderbookKind,
			offer: {
				tokenId,
				quantity: parseUnits(quantity, collectibleDecimals).toString(),
				expiry,
				currencyAddress: offerPrice.currency.contractAddress,
				pricePerToken: offerPrice.amountRaw,
			},
			additionalFees: [],
		});

		return steps || [];
	};

	// ✅ Main offer mutation
	const offerMutation = useMutation({
		mutationFn: async () => {
			const steps = await generateOfferSteps();
			if (!steps.length) {
				throw new Error('No transaction steps found');
			}

			// Execute all steps and get result
			const result = await transaction.executeAsync(steps);

			// Track analytics after getting hash
			if (result.hash || result.orderId) {
				const currencyDecimal = offerPrice.currency.decimals || 0;
				const currencyValueRaw = Number(offerPrice.amountRaw);
				const currencyValueDecimal = Number(
					formatUnits(BigInt(currencyValueRaw), currencyDecimal),
				);

				let requestId = result.orderId;

				if (
					result.hash &&
					publicClient &&
					address &&
					(orderbookKind === OrderbookKind.sequence_marketplace_v1 ||
						orderbookKind === OrderbookKind.sequence_marketplace_v2)
				) {
					requestId = await getSequenceMarketplaceRequestId(
						result.hash,
						publicClient,
						address,
					);
				}

				analytics.trackCreateOffer({
					props: {
						orderbookKind,
						collectionAddress,
						currencyAddress: offerPrice.currency.contractAddress,
						currencySymbol: offerPrice.currency.symbol || '',
						chainId: chainId.toString(),
						requestId: requestId || '',
						txnHash: result.hash || '',
					},
					nums: {
						currencyValueDecimal,
						currencyValueRaw,
					},
				});
			}

			return result;
		},
		onSuccess: (result) => {
			// Invalidate relevant queries to refresh data
			queryClient.invalidateQueries({
				queryKey: collectableKeys.offers,
			});
			queryClient.invalidateQueries({
				queryKey: balanceQueries.lists,
			});

			// Close modal and trigger success callback
			makeOfferModalStore.send({ type: 'close' });
			callbacks?.onSuccess?.({
				hash: result.hash,
				orderId: result.orderId,
			});
		},
		onError: (error) => {
			console.error('Offer failed:', error);
			callbacks?.onError?.(error as Error);
		},
	});

	// ✅ Approval mutation
	const approvalMutation = useMutation({
		mutationFn: async () => {
			if (!tokenApproval?.step) {
				throw new Error('No approval step available');
			}

			const result = await processStep(tokenApproval.step, chainId);

			if (result.type === 'transaction') {
				await waitForTransactionReceipt({
					txHash: result.hash,
					chainId,
					sdkConfig,
				});
			}

			return result;
		},
		onSuccess: () => {
			// Refresh approval state after successful approval
			queryClient.invalidateQueries({
				queryKey: ['tokenApproval', chainId, collectionAddress, tokenId],
			});
		},
		onError: (error) => {
			console.error('Approval failed:', error);
			callbacks?.onError?.(error as Error);
		},
	});

	// ✅ Action handlers - no useCallback needed
	const handleMakeOffer = () => {
		if (isWaaS) {
			selectWaasFeeOptionsStore.send({ type: 'show' });
		}
		offerMutation.mutate();
	};

	const handleApproval = () => {
		approvalMutation.mutate();
	};

	// ✅ Derive all state - no useState, no useMemo
	const approvalNeeded = tokenApproval?.step != null;
	const isProcessing =
		offerMutation.isPending ||
		approvalMutation.isPending ||
		transaction.isPending ||
		isGeneratingSteps;
	const showWaasFeeOptions = isWaaS && isProcessing && feeOptionsVisible;

	// ✅ Collect all errors for consolidation
	const errors = [
		{ error: approvalCheckError, title: 'Failed to check approval' },
		{ error: generateError, title: 'Failed to generate offer' },
		{ error: approvalMutation.error, title: 'Approval failed' },
		{ error: offerMutation.error, title: 'Offer failed' },
		{ error: transaction.error, title: 'Transaction failed' },
	];

	return {
		// Actions
		handleMakeOffer,
		handleApproval,

		// State
		approvalNeeded,
		isProcessing,
		isCheckingApproval,
		showWaasFeeOptions,
		isApproving: approvalMutation.isPending,

		// Errors
		errors,

		// Raw data if needed
		rawData: { tokenApproval },
	};
};
