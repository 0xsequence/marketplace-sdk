import type { Marketplace } from '@0xsequence/api-client';
import type { Observable } from '@legendapp/state';
import { type Address, formatUnits, type Hex } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import type { Price } from '../../../../../types';
import { getSequenceMarketplaceRequestId } from '../../../../../utils/getSequenceMarketRequestId';
import {
	OrderbookKind,
	StepType,
	type TransactionSteps,
} from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import { TransactionType } from '../../../../_internal/types';
import {
	useConfig,
	useConnectorMetadata,
	useCurrencyList,
	useGenerateListingTransaction,
	useProcessStep,
} from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils/waitForTransactionReceipt';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import type { CreateListingInput } from './useCreateListing';

interface UseTransactionStepsArgs {
	listingInput: CreateListingInput;
	chainId: number;
	collectionAddress: Address;
	orderbookKind: OrderbookKind;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useTransactionSteps = ({
	listingInput,
	chainId,
	collectionAddress,
	orderbookKind,
	closeMainModal,
	steps$,
}: UseTransactionStepsArgs) => {
	const { address } = useAccount();
	const publicClient = usePublicClient();
	const { walletKind } = useConnectorMetadata();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const { data: currencies } = useCurrencyList({
		chainId,
	});
	const currency = currencies?.find(
		(c: Marketplace.Currency) =>
			c.contractAddress === listingInput.listing.currencyAddress,
	);
	const analytics = useAnalytics();
	const { processStep } = useProcessStep();
	const { generateListingTransactionAsync, isPending: generatingSteps } =
		useGenerateListingTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
			},
		});

	const getListingSteps = async () => {
		if (!address) return;

		try {
			const steps = await generateListingTransactionAsync({
				collectionAddress,
				owner: address,
				walletType: walletKind,
				contractType: listingInput.contractType,
				orderbook: orderbookKind,
				listing: {
					tokenId: listingInput.listing.tokenId,
					quantity: listingInput.listing.quantity,
					currencyAddress: listingInput.listing.currencyAddress,
					pricePerToken: listingInput.listing.pricePerToken,
					expiry: new Date(Number(listingInput.listing.expiry) * 1000),
				},
				additionalFees: [],
			});

			return steps;
		} catch (error) {
			console.debug('Error generating listing steps:', error);
		}
	};

	const executeApproval = async () => {
		if (!address) return;

		try {
			steps$.approval.isExecuting.set(true);
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
				steps$.approval.isExecuting.set(false);
				steps$.approval.exist.set(false);
			}
		} catch (_error) {
			steps$.approval.isExecuting.set(false);
		}
	};

	const createListing = async ({
		isTransactionExecuting,
	}: {
		isTransactionExecuting: boolean;
	}) => {
		if (!address) return;

		try {
			steps$.transaction.isExecuting.set(isTransactionExecuting);
			const steps = await getListingSteps();
			if (!steps) throw new Error('No steps found');

			let hash: Hex | undefined;
			let orderId: string | undefined;

			if (steps) {
				for (const step of steps) {
					const result = await processStep(step, chainId);
					if (result.type === 'transaction') {
						hash = result.hash;
					} else if (result.type === 'signature') {
						orderId = result.orderId;
					}
				}
			}

			closeMainModal();

			showTransactionStatusModal({
				type: TransactionType.LISTING,
				collectionAddress,
				chainId,
				tokenId: listingInput.listing.tokenId,
				hash,
				orderId,
				price: {
					amountRaw: BigInt(listingInput.listing.pricePerToken),
					currency,
				} as Price,
				queriesToInvalidate: [
					['collectible', 'market-lowest-listing'],
					['collectible', 'market-list-listings'],
					['collectible', 'market-count-listings'],
					['token', 'balances'],
				],
			});

			if (hash) {
				await waitForTransactionReceipt({
					txHash: hash,
					chainId,
					sdkConfig,
				});

				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);
			}

			if (orderId) {
				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);
			}

			if (hash || orderId) {
				const currencyDecimal =
					currencies?.find(
						(c: Marketplace.Currency) =>
							c.contractAddress === listingInput.listing.currencyAddress,
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
						tokenId: listingInput.listing.tokenId.toString(),
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
		} catch (_error) {
			steps$.transaction.isExecuting.set(false);
			steps$.transaction.exist.set(false);
		}
	};

	return {
		generatingSteps,
		executeApproval,
		createListing,
	};
};
