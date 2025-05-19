import type { Observable } from '@legendapp/state';
import { type Address, type Hex, formatUnits } from 'viem';
import { OrderbookKind, type Price } from '../../../../../types';
import { getSequenceMarketplaceRequestId } from '../../../../../utils/getSequenceMarketRequestId';
import {
	type Step,
	StepType,
	type TransactionSteps,
	balanceQueries,
	collectableKeys,
	getMarketplaceClient,
} from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import { TransactionType } from '../../../../_internal/types';
import type { ListingInput } from '../../../../_internal/types';
import type {
	SignatureStep,
	TransactionStep as WalletTransactionStep,
} from '../../../../_internal/utils';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import {
	useConfig,
	useGenerateListingTransaction,
	useMarketCurrencies,
} from '../../../../hooks';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../../_internal/types';
interface UseTransactionStepsArgs {
	listingInput: ListingInput;
	chainId: number;
	collectionAddress: string;
	orderbookKind: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useTransactionSteps = ({
	listingInput,
	chainId,
	collectionAddress,
	orderbookKind,
	callbacks,
	closeMainModal,
	steps$,
}: UseTransactionStepsArgs) => {
	const { wallet } = useWallet();
	const expiry = new Date(Number(listingInput.listing.expiry) * 1000);
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const { data: currencies } = useMarketCurrencies({
		chainId,
	});
	const currency = currencies?.find(
		(currency) =>
			currency.contractAddress === listingInput.listing.currencyAddress,
	);
	const marketplaceClient = getMarketplaceClient(chainId, sdkConfig);
	const analytics = useAnalytics();
	const { generateListingTransactionAsync, isPending: generatingSteps } =
		useGenerateListingTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
			},
		});

	const getListingSteps = async () => {
		if (!wallet) return;

		try {
			const address = await wallet.address();

			const steps = await generateListingTransactionAsync({
				collectionAddress,
				owner: address,
				walletType: wallet.walletKind,
				contractType: listingInput.contractType,
				orderbook: orderbookKind,
				listing: {
					...listingInput.listing,
					expiry,
				},
			});

			return steps;
		} catch (error) {
			if (callbacks?.onError) {
				callbacks.onError(error as Error);
			} else {
				console.debug('onError callback not provided:', error);
			}
		}
	};

	const executeApproval = async () => {
		if (!wallet) return;

		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getListingSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.tokenApproval),
			);

			const hash = await wallet.handleSendTransactionStep(
				Number(chainId),
				approvalStep as WalletTransactionStep,
			);

			await wallet.handleConfirmTransactionStep(hash, Number(chainId));
			steps$.approval.isExecuting.set(false);
			steps$.approval.exist.set(false);
		} catch (error) {
			steps$.approval.isExecuting.set(false);
		}
	};

	const createListing = async ({
		isTransactionExecuting,
	}: {
		isTransactionExecuting: boolean;
	}) => {
		if (!wallet) return;

		try {
			steps$.transaction.isExecuting.set(isTransactionExecuting);
			const steps = await getListingSteps();
			const transactionStep = steps?.find(
				(step) => step.id === StepType.createListing,
			);
			const signatureStep = steps?.find(
				(step) => step.id === StepType.signEIP712,
			);

			console.debug('transactionStep', transactionStep);
			console.debug('signatureStep', signatureStep);

			if (!transactionStep && !signatureStep) {
				throw new Error('No transaction or signature step found');
			}

			let hash: Hex | undefined;
			let orderId: string | undefined;

			if (transactionStep) {
				hash = await executeTransaction({ transactionStep });
			}

			if (signatureStep) {
				orderId = await executeSignature({ signatureStep });
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
				await wallet.handleConfirmTransactionStep(hash, Number(chainId));

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
						(currency) =>
							currency.contractAddress === listingInput.listing.currencyAddress,
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
						wallet.publicClient,
						await wallet.address(),
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
		} catch (error) {
			steps$.transaction.isExecuting.set(false);
			steps$.transaction.exist.set(false);

			if (callbacks?.onError && typeof callbacks.onError === 'function') {
				callbacks.onError(error as Error);
			}
		}
	};

	const executeTransaction = async ({
		transactionStep,
	}: {
		transactionStep: Step;
	}) => {
		if (!wallet) return;

		const hash = await wallet.handleSendTransactionStep(
			Number(chainId),
			transactionStep as WalletTransactionStep,
		);

		return hash;
	};

	const executeSignature = async ({
		signatureStep,
	}: {
		signatureStep: Step;
	}) => {
		if (!wallet) return;

		const signature = await wallet.handleSignMessageStep(
			signatureStep as SignatureStep,
		);

		const result = await marketplaceClient.execute({
			signature: signature as string,
			method: signatureStep.post?.method as string,
			endpoint: signatureStep.post?.endpoint as string,
			body: signatureStep.post?.body,
		});

		return result.orderId;
	};

	return {
		generatingSteps,
		executeApproval,
		createListing,
	};
};
