'use client';

import { getNetwork } from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
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
import { useSell } from './hooks/useSell';
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
		isLoading: isSellLoading,
		executeApproval,
		sell,
		tokenApprovalStepExists,
		sellIsBeingProcessed,
	} = useSell();

	const {
		collection,
		currency,
		isError,
		isLoading,
		shouldHideSellButton,
		wallet,
	} = useLoadData();

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

		try {
			if (wallet?.isWaaS) {
				selectWaasFeeOptions$.isVisible.set(true);
			}

			await sell({
				isTransactionExecuting: wallet?.isWaaS ? !isTestnet : false,
			});
		} catch (error) {
			console.error('Sell failed:', error);
		} finally {
			sellModalStore.send({ type: 'setSellIsBeingProcessed', value: false });
		}
	};

	const network = getNetwork(chainId);
	const isTestnet = network.type === NetworkType.TESTNET;

	// if it's testnet, we don't need to show the fee options
	const sellCtaLabel = sellIsBeingProcessed
		? wallet?.isWaaS && !isTestnet
			? 'Loading fee options'
			: 'Accept'
		: 'Accept';

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: async () => await executeApproval(),
			hidden: !tokenApprovalStepExists,
			pending: 
			variant: 'glass' as const,
			disabled: isSellLoading || order?.quantityRemaining === '0',
		},
		{
			label: sellCtaLabel,
			onClick: () => handleSell(),
			pending: sellIsBeingProcessed,
			disabled:
				isSellLoading ||
				tokenApprovalStepExists ||
				order?.quantityRemaining === '0',
		},
	] satisfies ActionModalProps['ctas'];

	const showWaasFeeOptions =
		wallet?.isWaaS && sellIsBeingProcessed && feeOptionsVisible;

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
