import { useMutation } from '@tanstack/react-query';
import { type Address, formatUnits, type Hex } from 'viem';
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
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../../_internal/types';

interface UseTransactionStepsArgs {
	listingInput: ListingInput;
	chainId: number;
	collectionAddress: Address;
	orderbookKind: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
}

export const useTransactionSteps = ({
	listingInput,
	chainId,
	collectionAddress,
	orderbookKind,
	callbacks,
	closeMainModal,
}: UseTransactionStepsArgs) => {
	const { address } = useAccount();
	const publicClient = usePublicClient();
	const { walletKind } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const { data: currencies } = useMarketCurrencies({
		chainId,
	});
	const currency = currencies?.find(
		(currency) =>
			currency.contractAddress === listingInput.listing.currencyAddress,
	);
	const analytics = useAnalytics();
	const { processStep } = useProcessStep();
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
				if (!address) return;

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

				const steps = await getListingSteps();
				if (!steps) throw new Error('No steps found');

				let hash: Hex | undefined;
				let orderId: string | undefined;

				for (const step of steps) {
					const result = await processStep(step, chainId);
					if (result.type === 'transaction') {
						hash = result.hash;
					} else if (result.type === 'signature') {
						orderId = result.orderId;
					}
				}

				closeMainModal();

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

				if (hash || orderId) {
					const currencyDecimal =
						currencies?.find(
							(currency) =>
								currency.contractAddress ===
								listingInput.listing.currencyAddress,
						)?.decimals || 0;

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
		generatingSteps,
		executeApproval,
		createListing,
		approvalExecuting,
		createListingExecuting,
	};
};
