import { ContractType, type Hash } from '@0xsequence/api-client';
import { useSupportedChains } from '0xtrails';
import { type Chain, formatUnits } from 'viem';
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
		currency,
		marketOrder,
		collectionAddress,
		primarySaleItem,
		isLoading: isBuyModalDataLoading,
		isMarket,
		isShop,
		error,
		refetchQueries,
	} = useBuyModalData();

	const transactionData = useBuyTransaction({
		modalProps,
		primarySalePrice: {
			amount: primarySaleItem?.priceAmount,
			currencyAddress: primarySaleItem?.currencyAddress,
		},
		contractType:
			collection?.type === ContractType.ERC1155
				? ContractType.ERC1155
				: ContractType.ERC721,
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

	const formattedAmount =
		currency?.decimals && buyStep?.price
			? formatUnits(BigInt(buyStep.price), currency.decimals)
			: undefined;

	const handleTransactionSuccess = (hash: Hash) => {
		if (!collectible) throw new Error('Collectible not found');
		if (isMarket && !marketOrder) throw new Error('Order not found');
		if (!currency) throw new Error('Currency not found');

		const amountRaw = isMarket
			? marketOrder?.priceAmount
			: primarySaleItem?.priceAmount;
		if (amountRaw == null) throw new Error('Price amount not found');

		close();

		transactionStatusModal.show({
			hash,
			orderId: isMarket ? marketOrder?.orderId : undefined,
			price: {
				amountRaw,
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

	const refetchAll = async () => {
		await refetchQueries();
		await transactionData.refetch();
	};

	return {
		config,
		modalProps,
		close: handleClose,
		steps,
		collectible,
		collection,
		primarySaleItem,
		marketOrder,
		isShop,
		buyStep,
		isLoading,
		checkoutMode,
		formattedAmount,
		handleTransactionSuccess,
		handleTrailsSuccess,
		error: error || transactionData.error,
		refetchAll,
	};
}

export type BuyModalContext = ReturnType<typeof useBuyModalContext>;
