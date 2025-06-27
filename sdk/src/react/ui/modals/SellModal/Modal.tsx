'use client';

import { useEffect, useState } from 'react';
import type { Price } from '../../../../types';
import type { FeeOption } from '../../../../types/waas-types';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import { useLoadData } from './hooks/useLoadData';
import { useTransactionSteps } from './hooks/useTransactionSteps';
import {
	sellModalStore,
	useIsOpen,
	useSellIsBeingProcessed,
	useSellModalProps,
} from './store';

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
		executeApproval,
		sell,
		isApproveTokenPending,
		isSellPending,
		generatingSteps,
	} = useTransactionSteps({
		collectibleId: tokenId,
		chainId,
		collectionAddress,
		marketplace: order?.marketplace,
		ordersData,
	});

	const isProcessing = useSellIsBeingProcessed();
	const [isWaaS, setIsWaaS] = useState(false);

	useEffect(() => {
		if (wallet) {
			setIsWaaS(wallet.isWaaS);
		}
	}, [wallet]);

	if (isError && !isLoading) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={() => sellModalStore.send({ type: 'close' })}
				title="You have an offer"
			/>
		);
	}

	const handleSell = async () => {
		sellModalStore.send({ type: 'setSellIsBeingProcessed', value: true });

		try {
			if (isWaaS) {
				selectWaasFeeOptionsStore.send({ type: 'show' });
			}

			await sell();
		} catch (error) {
			console.error('Sell failed:', error);
		} finally {
			sellModalStore.send({ type: 'setSellIsBeingProcessed', value: false });
		}
	};

	const sellCtaLabel = isProcessing
		? isWaaS
			? 'Loading fee options'
			: 'Accept'
		: 'Accept';

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => await executeApproval(),
			hidden: !tokenApproval?.data?.step,
			pending: isApproveTokenPending,
			variant: 'glass' as const,
			disabled: generatingSteps || order?.quantityRemaining === '0',
		},
		{
			label: sellCtaLabel,
			onClick: () => handleSell(),
			pending: isSellPending || isProcessing,
			disabled:
				generatingSteps ||
				isApproveTokenPending ||
				tokenApproval?.data?.step ||
				order?.quantityRemaining === '0',
		},
	] satisfies ActionModalProps['ctas'];

	const showWaasFeeOptions = isWaaS && isProcessing && feeOptionsVisible;

	return (
		<ActionModal
			isOpen={true}
			chainId={Number(chainId)}
			onClose={() => {
				sellModalStore.send({ type: 'close' });
				selectWaasFeeOptionsStore.send({ type: 'hide' });
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
					chainId={Number(chainId)}
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
