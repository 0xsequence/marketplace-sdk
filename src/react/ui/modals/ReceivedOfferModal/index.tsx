import { useAccount, useSendTransaction } from 'wagmi';
import {
	ActionModal,
	ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { receivedOfferModal$, type ReceivedOfferModalState } from './_store';
import { observer } from '@legendapp/state/react';
import { useCollection } from '@react-hooks/useCollection';
import { useSwitchNetworkModal } from '../_internal/components/switchNetworkModal';
import { useApproveToken } from '@react-hooks/useApproveToken';
import { ContractType, StepType } from '@types';
import { useGenerateSellTransaction } from '@react-hooks/useGenerateSellTransaction';
import { useToast } from '@0xsequence/design-system';
import { Address } from 'viem';
import marketplaceToastMessages from '../../../consts/toastMessages';
import TransactionHeader from '../_internal/components/transactionHeader';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import { getSellModalMessage, getSellModalTitle } from './utils';
import { useCollectible } from '@react-hooks/useCollectible';

export const useReceivedOfferModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchNetworkModal();

	function openReceivedOfferModal(args: ReceivedOfferModalState['state']) {
		receivedOfferModal$.open(args);
	}

	function handleShowModal(args: ReceivedOfferModalState['state']) {
		const isSameChain = accountChainId === Number(args.chainId);

		if (!isSameChain) {
			showSwitchNetworkModal({
				chainIdToSwitchTo: Number(args.chainId),
				onSwitchChain: () => {
					openReceivedOfferModal(args);
				},
			});

			return;
		}

		openReceivedOfferModal({
			...args,
		});
	}

	return {
		show: (args: ReceivedOfferModalState['state']) => handleShowModal(args),
		close: () => receivedOfferModal$.close(),
	};
};

export const ReceivedOfferModal = observer(() => {
	const { collectionAddress, chainId, tokenId, order, price } =
		receivedOfferModal$.state.get();
	const { data: collection } = useCollection({
		chainId: chainId,
		collectionAddress: collectionAddress,
	});
	const { data: collectible } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId: tokenId,
	});
	const { tokenApprovalNeeded, approveToken, result } = useApproveToken({
		chainId,
		collectionAddress: collectionAddress,
		collectionType: collection?.type as ContractType,
		tokenId,
	});
	const { generateSellTransactionAsync, isPending: offerAccepting } =
		useGenerateSellTransaction({ chainId: chainId });
	const { sendTransactionAsync, isPending: transactionSending } =
		useSendTransaction();
	const toast = useToast();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();

	async function handleSellTransaction() {
		try {
			const data = await generateSellTransactionAsync({
				collectionAddress,
				buyer: order!.createdBy,
				marketplace: order!.marketplace,
				ordersData: [
					{
						...order,
						quantity: order!.quantityInitial,
						orderId: order!.orderId || '',
					},
				],
				additionalFees: [
					{
						amount: String(order!.feeBps),
						receiver: order!.feeBreakdown[0].recipientAddress,
					},
				],
			});

			const sellTransaction = data?.steps.find(
				(step) => step.id === StepType.sell,
			);

			if (!sellTransaction) return;

			const hash = await sendTransactionAsync({
				chainId: Number(chainId),
				to: sellTransaction.to as Address,
				data: sellTransaction.data as Address,
				value: BigInt(sellTransaction.value) || BigInt(0),
			});

			receivedOfferModal$.close();
			showTransactionStatusModal({
				hash: hash!,
				chainId,
				collectionAddress,
				tokenId,
				getTitle: (isConfirmed, isConfirming, isFailed) =>
					getSellModalTitle({
						isConfirmed,
						isConfirming,
						isFailed,
					}),
				getMessage: (isConfirmed, isConfirming, isFailed) =>
					getSellModalMessage({
						isConfirmed,
						isConfirming,
						isFailed,
						collectibleName: collectible?.name || '',
					}),
				creatorAddress: order?.createdBy as Address,
			});
		} catch (error) {
			toast({
				title: marketplaceToastMessages.sellCollectible.unkownError.title,
				description:
					marketplaceToastMessages.sellCollectible.unkownError.description,
				variant: 'error',
			});
		}
	}

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: approveToken,
			hidden: !tokenApprovalNeeded || result.isSuccess,
			pending: result.isPending,
			variant: 'glass' as const,
		},
		{
			label: 'Accept',
			onClick: handleSellTransaction,
			pending: offerAccepting || transactionSending,
		},
	] satisfies ActionModalProps['ctas'];

	return (
		<ActionModal
			store={receivedOfferModal$}
			onClose={() => receivedOfferModal$.close()}
			title="You have an offer"
			ctas={ctas}
		>
			<TransactionHeader
				title="Offer received"
				chainId={Number(chainId)}
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
				price={price}
			/>
		</ActionModal>
	);
});
