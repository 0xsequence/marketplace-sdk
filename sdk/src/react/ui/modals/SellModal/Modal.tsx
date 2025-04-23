'use client';

import type { Price } from '../../../../types';
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
import {
	sellModalStore,
	useIsOpen,
	useSellModalProps,
} from './store';
import { useState } from 'react';

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
	} = useLoadData();

	const { executeApproval, isApproveTokenPending } = useTransactionSteps({
		collectibleId: tokenId,
		chainId,
		collectionAddress,
		marketplace: MarketplaceKind.SELL,
		ordersData: [order],
	});


   const [hideApproveToken, setHideApproveToken] = useState(false);
   const [isApproveTokenPending, setIsApproveTokenPending] = useState(false);
   const [isSellPending, setIsSellPending] = useState(false);

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

	let sellCtaLabel = 'Accept';

	const handleSell = async () => {
		sellModalStore.send({ type: 'setSellIsBeingProcessed', value: true });

		if (wallet?.isWaaS) {
			selectWaasFeeOptions$.isVisible.set(true);
			sellCtaLabel = 'Loading fee options';
		}

		try {
			// await sell();
		} catch (error) {
			console.error('Sell failed:', error);
		} finally {
			sellModalStore.send({ type: 'setSellIsBeingProcessed', value: false });
		}
	};



	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => await executeApproval(),
			hidden: hideApproveToken,
			pending: isApproveTokenPending,
			variant: 'glass' as const,
			disabled: isSellLoading || order?.quantityRemaining === '0',
		},
		{
			label: sellCtaLabel,
			onClick: () => handleSell(),
			pending: isSellPending,
			disabled:
				isSellLoading ||
				tokenApprovalStepExists ||
				order?.quantityRemaining === '0',
		},
	] satisfies ActionModalProps['ctas'];

	const showWaasFeeOptions =
		wallet?.isWaaS && feeOptionsVisible;

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
