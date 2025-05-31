'use client';

import { use$ } from '@legendapp/state/react';
import { useEffect, useState } from 'react';
import type { Price } from '../../../../types';
import type { MarketplaceKind } from '../../../_internal/api/marketplace.gen';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import { selectWaasFeeOptions$ } from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useLoadData } from './hooks/useLoadData';
import { useTransactionSteps } from './hooks/useTransactionSteps';
import { sellModalStore, useIsOpen, useSellModalProps } from './store';

export const SellModal = () => {
	const isOpen = useIsOpen();

	if (!isOpen) {
		return null;
	}

	return <SellModalContent />;
};

const SellModalContent = () => {
	const { tokenId, collectionAddress, chainId, order } = useSellModalProps();

	const {
		collection,
		currency,
		isError,
		isLoading,
		shouldHideSellButton,
		wallet,
		feeOptionsVisible,
		tokenApproval,
		ordersData,
	} = useLoadData();

	const {
		executeApproval: transactionExecuteApproval,
		sell: transactionSell,
		generatingSteps,
		isApproveTokenPending,
		isSellPending,
	} = useTransactionSteps({
		collectibleId: tokenId,
		chainId,
		currencyAddress: order?.priceCurrencyAddress ?? '',
	});

	const network = getNetwork(Number(chainId));
	const isTestnet = network.type === NetworkType.TESTNET;
	const isProcessing = sellModal$.sellIsBeingProcessed.get();
	const isWaaS = wallet?.isWaaS;

	const {
		isLoading: isSellLoading,
		executeApproval,
		sell,
	} = useSell({
		collectionAddress,
		marketplace: order?.marketplace as MarketplaceKind,
		ordersData,
	});

	const [hideApproveToken, setHideApproveToken] = useState(false);
	const tokenApprovalStepExists = tokenApproval?.step !== null;

	const pendingFeeOptionConfirmation = use$(
		selectWaasFeeOptions$.pendingFeeOptionConfirmation,
	);

	const isSelectWaasFeeOptionsVisible = use$(selectWaasFeeOptions$.isVisible);

	// Monitor for WaaS fee confirmation
	useEffect(() => {
		if (!wallet?.isWaaS || !feeOptionsVisible) return;

		// Check if fee options were confirmed (modal closed and no pending confirmation)
		if (!pendingFeeOptionConfirmation && !isSelectWaasFeeOptionsVisible) {
			// Execute the sell transaction
			sell().catch((error) => {
				console.error('Sell failed:', error);
				sellModalStore.send({ type: 'setSellIsBeingProcessed', value: false });
			});
		}
	}, [
		pendingFeeOptionConfirmation,
		feeOptionsVisible,
		wallet?.isWaaS,
		sell,
		isSelectWaasFeeOptionsVisible,
	]);

	if (isError) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={chainId}
				onClose={() => sellModalStore.send({ type: 'close' })}
				title="You have an offer"
			/>
		);
	}

	const handleSell = async () => {
		sellModalStore.send({ type: 'setSellIsBeingProcessed', value: true });

		if (wallet?.isWaaS) {
			selectWaasFeeOptions$.isVisible.set(true);
		} else {
			try {
				await sell();
			} catch (error) {
				console.error('Sell failed:', error);
				sellModalStore.send({ type: 'setSellIsBeingProcessed', value: false });
			}
		}
	};

	const sellCtaLabel =
		wallet?.isWaaS && feeOptionsVisible ? 'Loading fee options' : 'Accept';

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => {
				setHideApproveToken(true);
				await executeApproval();
			},
			hidden: hideApproveToken || !tokenApprovalStepExists,
			pending: isApproveTokenPending,
			variant: 'glass' as const,
			disabled:
				generatingSteps || isSellLoading || order?.quantityRemaining === '0',
		},
		{
			label: sellCtaLabel,
			onClick: () => handleSell(),
			pending: isSellPending,
			disabled:
				generatingSteps ||
				isSellLoading ||
				(tokenApprovalStepExists && !hideApproveToken) ||
				order?.quantityRemaining === '0',
		},
	] satisfies ActionModalProps['ctas'];

	const showWaasFeeOptions = wallet?.isWaaS && feeOptionsVisible;

	return (
		<ActionModal
			isOpen={true}
			chainId={chainId}
			onClose={() => {
				sellModalStore.send({ type: 'close' });
				selectWaasFeeOptions$.hide();
			}}
			title="You have an offer"
			ctas={ctas}
			modalLoading={isLoading}
			spinnerContainerClassname="h-[104px]"
			hideCtas={shouldHideSellButton}
		>
			<TransactionHeader
				title="Offer received"
				currencyImageUrl={currency?.imageUrl}
				date={order && new Date(order.createdAt)}
			/>
			<TokenPreview
				collectionName={collection?.name}
				collectionAddress={collectionAddress}
				collectibleId={tokenId}
				chainId={chainId}
			/>
			<TransactionDetails
				collectibleId={tokenId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				includeMarketplaceFee={true}
				price={
					currency
						? ({
								amountRaw: order?.priceAmount,
								currency,
							} as Price)
						: undefined
				}
				currencyImageUrl={currency?.imageUrl}
			/>

			{showWaasFeeOptions && (
				<SelectWaasFeeOptions
					chainId={chainId}
					onCancel={() => {
						sellModalStore.send({
							type: 'setSellIsBeingProcessed',
							value: false,
						});
					}}
					titleOnConfirm="Accepting offer..."
				/>
			)}
		</ActionModal>
	);
};
