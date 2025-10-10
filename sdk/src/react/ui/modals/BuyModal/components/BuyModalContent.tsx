'use client';

import { Modal, Spinner, Text } from '@0xsequence/design-system';
import { type Chain, formatUnits, type Hash } from 'viem';
import { useSupportedChains } from 'xtrails';
import { TrailsWidget } from 'xtrails/widget';
import { TransactionType } from '../../../../_internal';
import { useConfig } from '../../../../hooks';
import { useBuyTransaction } from '../../../../hooks/transactions/useBuyTransaction';
import { useWaasFeeOptions } from '../../../../hooks/utils/useWaasFeeOptions';
import { MODAL_OVERLAY_PROPS } from '../../_internal/components/consts';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { useBuyModal } from '..';
import { useBuyModalData } from '../hooks/useBuyModalData';
import { useBuyModalProps, useOnSuccess } from '../store';
import { FallbackPurchaseUI } from './FallbackPurchaseUI';
import { TRAILS_CUSTOM_CSS } from './TrailsCss';

export const BuyModalContent = () => {
	const config = useConfig();
	const modalProps = useBuyModalProps();
	const { close } = useBuyModal();
	const onSuccess = useOnSuccess();
	const transactionStatusModal = useTransactionStatusModal();
	const { supportedChains, isLoadingChains } = useSupportedChains();
	const { data: steps, isLoading: isLoadingSteps } =
		useBuyTransaction(modalProps);
	const {
		collectible,
		currencyAddress,
		currency,
		order,
		collectionAddress,
		salePrice,
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

	const useTrailsModal = isChainSupported && buyStep && !isLoading;
	const useFallbackPurchaseUI = !useTrailsModal && steps && !isLoading;

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
				amountRaw: (isMarket ? order?.orderId : salePrice?.amount) ?? '0',
				currency,
			},
			collectionAddress,
			chainId: modalProps.chainId,
			collectibleId: collectible.tokenId,
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

	return (
		<Modal
			isDismissible
			onClose={handleClose}
			overlayProps={MODAL_OVERLAY_PROPS}
			contentProps={{
				style: {
					width: '450px',
					height: 'auto',
				},
			}}
		>
			<div className="relative flex grow flex-col items-center gap-4 p-6">
				<Text className="w-full text-center font-body font-bold text-large text-text-100">
					Complete Your Purchase
				</Text>

				{isLoading && (
					<div className="flex w-full items-center justify-center py-8">
						<div className="flex flex-col items-center gap-4">
							<Spinner size="lg" />
							<Text className="text-text-80">Loading payment options...</Text>
						</div>
					</div>
				)}

				{useTrailsModal && (
					<div className="w-full">
						<TrailsWidget
							appId={config.projectAccessKey}
							toChainId={modalProps.chainId}
							toAddress={buyStep.to}
							toToken={currencyAddress}
							toCalldata={buyStep.data}
							toAmount={formattedAmount}
							renderInline={true}
							theme="dark"
							customCss={TRAILS_CUSTOM_CSS}
							onDestinationConfirmation={handleTrailsSuccess}
						/>
					</div>
				)}

				{useFallbackPurchaseUI && (
					<FallbackPurchaseUI
						chainId={modalProps.chainId}
						steps={steps}
						onSuccess={handleTransactionSuccess}
					/>
				)}
			</div>
		</Modal>
	);
};
