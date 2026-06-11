import {
	ContractType,
	findApprovalStep,
	findBuyStep,
	type Hash,
} from '@0xsequence/api-client';
import { encodeDestinationCalls, useSupportedChains } from '0xtrails';
import { useMemo } from 'react';
import { type Address, type Chain, formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { TransactionType } from '../../../../_internal';
import { useConfig } from '../../../../hooks';
import { useBuyTransaction } from '../../../../hooks/transactions/useBuyTransaction';
import { useWaasFeeOptions } from '../../../../hooks/utils/useWaasFeeOptions';
import type { CheckoutMode } from '../../..';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { useBuyModal } from '..';
import { useBuyModalData } from '../hooks/useBuyModalData';
import { useBuyModalProps } from '../store';
import { buildTrailsMarketBuyActions } from './buildTrailsMarketBuyActions';
import { determineCheckoutMode } from './determineCheckoutMode';

type TrailsDestination = {
	recipient: Address;
	destinationCalldata: `0x${string}`;
	paymentTokenAddress: Address;
	paymentAmount: bigint;
};

export function useBuyModalContext() {
	const config = useConfig();
	const modalProps = useBuyModalProps();
	const checkoutModeConfig: CheckoutMode = config.checkoutMode ?? 'trails';
	const { close } = useBuyModal();
	const transactionStatusModal = useTransactionStatusModal();
	const { address: userWalletAddress } = useAccount();
	const { data: supportedChains = [], isLoading: isLoadingChains } =
		useSupportedChains();

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

	const contractType =
		collection?.type === ContractType.ERC1155
			? ContractType.ERC1155
			: ContractType.ERC721;

	const transactionData = useBuyTransaction({
		modalProps,
		primarySalePrice: {
			amount: primarySaleItem?.priceAmount,
			currencyAddress: primarySaleItem?.currencyAddress,
		},
		contractType,
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

	const buyStep = steps ? findBuyStep(steps) : undefined;
	const approvalStep = steps ? findApprovalStep(steps) : undefined;

	const trailsDestination = useMemo<TrailsDestination | undefined>(() => {
		if (!isMarket || !marketOrder || !buyStep || !userWalletAddress) {
			return undefined;
		}

		const trailsMarketBuyActions = buildTrailsMarketBuyActions({
			chainId: modalProps.chainId,
			buyStep,
			marketOrder,
			contractType,
			recipientAddress: userWalletAddress,
			approvalStep,
		});
		if (!trailsMarketBuyActions) {
			return undefined;
		}

		const destination = encodeDestinationCalls({
			calls: trailsMarketBuyActions.calls,
			tokenAddress: trailsMarketBuyActions.paymentTokenAddress,
			sweepTarget: userWalletAddress,
		});

		return {
			recipient: destination.recipient as Address,
			destinationCalldata: destination.destinationCalldata,
			paymentTokenAddress: trailsMarketBuyActions.paymentTokenAddress,
			paymentAmount: trailsMarketBuyActions.paymentAmount,
		};
	}, [
		approvalStep,
		buyStep,
		contractType,
		isMarket,
		marketOrder,
		modalProps.chainId,
		userWalletAddress,
	]);

	const checkoutMode = determineCheckoutMode({
		checkoutModeConfig,
		isChainSupported,
		canBeUsedWithTrails,
	});

	const paymentAmount =
		trailsDestination?.paymentAmount ??
		(buyStep
			? buyStep.price > 0n
				? buyStep.price
				: buyStep.value
			: undefined);
	const formattedAmount =
		currency?.decimals !== undefined && paymentAmount !== undefined
			? formatUnits(paymentAmount, currency.decimals)
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
		isMarket,
		isShop,
		buyStep,
		trailsDestination,
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
