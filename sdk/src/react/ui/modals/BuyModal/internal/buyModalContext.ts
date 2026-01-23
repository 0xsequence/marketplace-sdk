import { ContractType, type Hash } from '@0xsequence/api-client';
import { useSupportedChains } from '0xtrails';
import type { NFTTransfer } from '0xtrails';
import { type Chain, formatUnits } from 'viem';
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
import { determineCheckoutMode } from './determineCheckoutMode';

export function useBuyModalContext() {
	const config = useConfig();
	const modalProps = useBuyModalProps();
	const checkoutModeConfig: CheckoutMode = config.checkoutMode ?? 'trails';
	const { close } = useBuyModal();
	const transactionStatusModal = useTransactionStatusModal();
	const { supportedChains, isLoadingChains } = useSupportedChains();
	const { address: userWalletAddress } = useAccount();

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

	const buyStep = steps?.find((step) => step.id === 'buy');

	const nftTransfer: NFTTransfer | null = (() => {
		if (!isMarket || !marketOrder || !userWalletAddress || marketOrder.tokenId === undefined) {
			return null;
		}

		const baseTransfer = {
			contract: marketOrder.collectionContractAddress,
			tokenId: marketOrder.tokenId,
			recipient: userWalletAddress,
		};

		if (contractType === ContractType.ERC1155) {
			return { ...baseTransfer, type: 'ERC1155' as const, amount: 1n };
		}
		return { ...baseTransfer, type: 'ERC721' as const };
	})();

	const checkoutMode = determineCheckoutMode({
		checkoutModeConfig,
		isChainSupported,
		canBeUsedWithTrails,
	});

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
		nftTransfer,
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
