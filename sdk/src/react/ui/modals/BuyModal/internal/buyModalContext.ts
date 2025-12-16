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
import { useBuyModalProps } from '../store';

export function useBuyModalContext() {
	const config = useConfig();
	const modalProps = useBuyModalProps();
	const checkoutModeConfig: CheckoutMode = config.checkoutMode ?? 'trails';
	const { close } = useBuyModal();
	const transactionStatusModal = useTransactionStatusModal();
	const { supportedChains, isLoadingChains } = useSupportedChains();

	const {
		collectible,
		collection,
		currencyAddress,
		currency,
		order,
		collectionAddress,
		salePrice,
		marketPriceAmount,
		primarySaleItem,
		isLoading: isBuyModalDataLoading,
		isMarket,
		isShop,
	} = useBuyModalData();

	const transactionData = useBuyTransaction({
		modalProps,
		salePrice,
	});
	const steps = transactionData.data?.steps;
	const canBeUsedWithTrails =
		transactionData.data?.canBeUsedWithTrails ?? false;
	const isLoadingSteps = transactionData.isLoading;
	const { pendingFeeOptionConfirmation, rejectPendingFeeOption } =
		useWaasFeeOptions(modalProps.chainId, config);

	const isChainSupported = supportedChains.some(
		(chain: Chain) => chain.id === modalProps.chainId,
	);

	const isLoading = isLoadingSteps || isLoadingChains || isBuyModalDataLoading;

	const buyStep = steps?.find((step) => step.id === 'buy');

	let checkoutMode: CheckoutMode | undefined;

	if (
		checkoutModeConfig === 'trails' &&
		isChainSupported &&
		canBeUsedWithTrails
	) {
		checkoutMode = 'trails';
	} else if (
		checkoutModeConfig === 'trails' &&
		isChainSupported &&
		!canBeUsedWithTrails
	) {
		// Fallback to crypto when order doesn't support trails
		checkoutMode = 'crypto';
	} else if (checkoutModeConfig === 'trails' && !isChainSupported) {
		// Fallback to crypto when chain is not supported by trails
		checkoutMode = 'crypto';
	} else if (
		typeof checkoutModeConfig === 'object' &&
		checkoutModeConfig.mode === 'sequence-checkout'
	) {
		checkoutMode = {
			mode: 'sequence-checkout',
			options: checkoutModeConfig.options,
		};
	} else if (checkoutModeConfig === 'crypto') {
		checkoutMode = 'crypto';
	} else {
		checkoutMode = undefined;
	}

	const formattedAmount = currency?.decimals
		? formatUnits(BigInt(buyStep?.price || '0'), currency.decimals)
		: '0';

	const handleTransactionSuccess = (hash: Hash | string) => {
		if (!collectible) throw new Error('Collectible not found');
		if (isMarket && !order) throw new Error('Order not found');
		if (!currency) throw new Error('Currency not found');

		close();

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
		primarySaleItem,
		isMarket,
		isShop,
		buyStep,
		isLoading,
		checkoutMode,
		formattedAmount,
		handleTransactionSuccess,
		handleTrailsSuccess,
		pendingFeeOptionConfirmation,
	};
}

export type BuyModalContext = ReturnType<typeof useBuyModalContext>;
