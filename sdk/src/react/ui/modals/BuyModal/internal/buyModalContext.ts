import { useSupportedChains } from '0xtrails';
import { type Chain, formatUnits, type Hash } from 'viem';
import { TransactionType } from '../../../../_internal';
import { useConfig } from '../../../../hooks';
import { useBuyTransaction } from '../../../../hooks/transactions/useBuyTransaction';
import { useWaasFeeOptions } from '../../../../hooks/utils/useWaasFeeOptions';
import type { CheckoutMode } from '../../..';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { useBuyModal } from '..';
import { useBuyModalData } from '../hooks/useBuyModalData';
import { useBuyModalProps, useOnSuccess } from '../store';

export function useBuyModalContext() {
	const config = useConfig();
	const modalProps = useBuyModalProps();
	const checkoutMode: CheckoutMode = config.checkoutMode ?? 'trails';
	const { close } = useBuyModal();
	const onSuccess = useOnSuccess();
	const transactionStatusModal = useTransactionStatusModal();
	const { supportedChains, isLoadingChains } = useSupportedChains();
	const { data: steps, isLoading: isLoadingSteps } =
		useBuyTransaction(modalProps);
	const {
		collectible,
		collection,
		currencyAddress,
		currency,
		order,
		collectionAddress,
		salePrice,
		marketPriceAmount,
		isLoading: isBuyModalDataLoading,
		isMarket,
	} = useBuyModalData();
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } =
		useWaasFeeOptions(modalProps.chainId, config);

	const isChainSupported = supportedChains.some(
		(chain: Chain) => chain.id === modalProps.chainId,
	);

	const isLoading = isLoadingSteps || isLoadingChains || isBuyModalDataLoading;

	const buyStep = steps?.find((step) => step.id === 'buy');

	const useTrailsModal =
		checkoutMode === 'trails' && isChainSupported && buyStep && !isLoading;
	const useCryptoPaymentModal =
		(checkoutMode === 'crypto' ||
			(checkoutMode === 'trails' && !isChainSupported)) &&
		steps &&
		!isLoading;
	const useSequenceCheckoutModal =
		(typeof checkoutMode === 'object' &&
			checkoutMode.mode === 'sequence-checkout') ||
		checkoutMode === 'sequence-checkout';

	const formattedAmount = currency?.decimals
		? formatUnits(BigInt(buyStep?.price || '0'), currency.decimals)
		: '0';

	const handleTransactionSuccess = (hash: Hash | string) => {
		if (!collectible) throw new Error('Collectible not found');
		if (isMarket && !order) throw new Error('Order not found');
		if (!currency) throw new Error('Currency not found');

		close();
		onSuccess({ hash: hash as Hash });

		transactionStatusModal.show({
			hash: hash as Hash,
			orderId: isMarket ? order?.orderId : undefined,
			price: {
				amountRaw:
					(isMarket ? marketPriceAmount : salePrice?.amount) ?? BigInt(0),
				currency,
			},
			collectionAddress,
			chainId: modalProps.chainId,
			tokenId: collectible.tokenId,
			type: TransactionType.BUY,
		});
	};

	const handleTrailsSuccess = (data: {
		txHash: string;
		chainId: number;
		sessionId: string;
	}) => {
		handleTransactionSuccess(data.txHash as Hash);
	};

	const handleClose = () => {
		if (pendingFeeOptionConfirmation?.id) {
			console.log(
				'rejecting pending fee option',
				pendingFeeOptionConfirmation?.id,
			);
			rejectPendingFeeOption(pendingFeeOptionConfirmation?.id);
		}

		close();
	};

	return {
		config,
		modalProps,
		close: handleClose,
		steps,
		collectible,
		collection,
		currencyAddress,
		currency,
		order,
		collectionAddress,
		salePrice,
		marketPriceAmount,
		isMarket,
		buyStep,
		isLoading,
		useTrailsModal,
		useCryptoPaymentModal,
		useSequenceCheckoutModal,
		checkoutMode,
		formattedAmount,
		handleTransactionSuccess,
		handleTrailsSuccess,
		pendingFeeOptionConfirmation,
	};
}

export type BuyModalContext = ReturnType<typeof useBuyModalContext>;
