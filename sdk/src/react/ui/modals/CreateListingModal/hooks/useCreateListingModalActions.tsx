'use client';

import { useMutation } from '@tanstack/react-query';
import type { Address } from 'viem';
import { formatUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { OrderbookKind, type Price } from '../../../../../types';
import { getSequenceMarketplaceRequestId } from '../../../../../utils/getSequenceMarketRequestId';
import {
	balanceQueries,
	collectableKeys,
	StepType,
} from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import type { ListingInput } from '../../../../_internal/types';
import { TransactionType } from '../../../../_internal/types';
import {
	useConfig,
	useConnectorMetadata,
	useGenerateListingTransaction,
	useMarketCurrencies,
	useProcessStep,
} from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils/waitForTransactionReceipt';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../../_internal/types';
import { createListingModalStore } from '../store';

interface UseCreateListingModalActionsProps {
	listingInput: ListingInput;
	chainId: number;
	collectionAddress: Address;
	orderbookKind: OrderbookKind;
	callbacks?: ModalCallbacks;
	approvalNeeded: boolean;
}

export const useCreateListingModalActions = ({
	listingInput,
	chainId,
	collectionAddress,
	orderbookKind,
	callbacks,
	approvalNeeded,
}: UseCreateListingModalActionsProps) => {
	const { address } = useAccount();
	const publicClient = usePublicClient();
	const { walletKind, isWaaS } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const analytics = useAnalytics();
	const { processStep } = useProcessStep();
	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();

	const { data: currencies } = useMarketCurrencies({
		chainId,
	});

	// ✅ State colocation - calculate currency data where it's used
	const currency = currencies?.find(
		(currency) =>
			currency.contractAddress === listingInput.listing.currencyAddress,
	);

	const { generateListingTransactionAsync, isPending: generatingSteps } =
		useGenerateListingTransaction({
			chainId,
		});

	const getListingSteps = async () => {
		if (!address) return;

		const steps = await generateListingTransactionAsync({
			collectionAddress,
			owner: address,
			walletType: walletKind,
			contractType: listingInput.contractType,
			orderbook: orderbookKind,
			listing: {
				...listingInput.listing,
				expiry: new Date(Number(listingInput.listing.expiry) * 1000),
			},
			additionalFees: [],
		});

		return steps;
	};

	const { mutateAsync: executeApproval, isPending: approvalExecuting } =
		useMutation({
			mutationFn: async () => {
				if (!address || !approvalNeeded) return;

				const approvalStep = await getListingSteps().then((steps) =>
					steps?.find((step) => step.id === StepType.tokenApproval),
				);

				if (!approvalStep) {
					throw new Error('No approval step found');
				}

				const result = await processStep(approvalStep, chainId);

				if (result.type === 'transaction') {
					await waitForTransactionReceipt({
						txHash: result.hash,
						chainId,
						sdkConfig,
					});
				}
			},
			onError: callbacks?.onError,
		});

	const { mutateAsync: createListing, isPending: createListingExecuting } =
		useMutation({
			mutationFn: async () => {
				if (!address) return;

				if (isWaaS) {
					selectWaasFeeOptionsStore.send({ type: 'show' });
				}

				const steps = await getListingSteps();
				if (!steps) throw new Error('No steps found');

				let hash: Address | undefined;
				let orderId: string | undefined;

				for (const step of steps) {
					const result = await processStep(step, chainId);
					if (result.type === 'transaction') {
						hash = result.hash;
					} else if (result.type === 'signature') {
						orderId = result.orderId;
					}
				}

				// Close the main modal
				createListingModalStore.send({ type: 'close' });

				showTransactionStatusModal({
					type: TransactionType.LISTING,
					collectionAddress: collectionAddress as Address,
					chainId,
					collectibleId: listingInput.listing.tokenId,
					hash,
					orderId,
					callbacks,
					price: {
						amountRaw: listingInput.listing.pricePerToken,
						currency,
					} as Price,
					queriesToInvalidate: [
						balanceQueries.all,
						collectableKeys.lowestListings,
						collectableKeys.listings,
						collectableKeys.listingsCount,
						collectableKeys.userBalances,
					],
				});

				if (hash) {
					await waitForTransactionReceipt({
						txHash: hash,
						chainId,
						sdkConfig,
					});
				}

				// ✅ Analytics tracking - only if transaction succeeded
				if (hash || orderId) {
					const currencyDecimal = currency?.decimals || 0;
					const currencyValueRaw = Number(listingInput.listing.pricePerToken);
					const currencyValueDecimal = Number(
						formatUnits(BigInt(currencyValueRaw), currencyDecimal),
					);

					let requestId = orderId;

					if (
						hash &&
						(orderbookKind === OrderbookKind.sequence_marketplace_v1 ||
							orderbookKind === OrderbookKind.sequence_marketplace_v2)
					) {
						requestId = await getSequenceMarketplaceRequestId(
							hash,
							publicClient!,
							address,
						);
					}

					analytics.trackCreateListing({
						props: {
							orderbookKind,
							collectionAddress,
							currencyAddress: listingInput.listing.currencyAddress,
							currencySymbol: currency?.symbol || '',
							tokenId: listingInput.listing.tokenId,
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
			},
			onError: callbacks?.onError,
		});

	return {
		executeApproval,
		createListing,
		approvalExecuting,
		createListingExecuting,
		generatingSteps,
		isWaaS,
		feeOptionsVisible,
		selectedFeeOption,
	};
};
