import {
	useAccount,
	useSendTransaction,
	useWaitForTransactionReceipt,
} from 'wagmi';
import {
	ActionModal,
	ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
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
	const { collectionAddress, chainId, tokenId, price, order } =
		receivedOfferModal$.state.get();
	const { data: collection } = useCollection({
		chainId: chainId,
		collectionAddress: collectionAddress,
	});
	const { tokenApprovalNeeded, approveToken, result } = useApproveToken({
		chainId,
		collectionAddress: collectionAddress,
		collectionType: collection?.type as ContractType,
		tokenId,
	});
	const { generateSellTransactionAsync, isPending: offerAccepting } =
		useGenerateSellTransaction({ chainId: chainId });
	const {
		data: hash,
		sendTransactionAsync,
		isPending: transactionSending,
	} = useSendTransaction();
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});
	console.log('isConfirming', isConfirming, 'isConfirmed', isConfirmed);
	const toast = useToast();

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

			await sendTransactionAsync({
				chainId: Number(chainId),
				to: sellTransaction.to as Address,
				data: sellTransaction.data as Address,
				value: BigInt(sellTransaction.value) || BigInt(0),
			});

			toast({
				title: marketplaceToastMessages.sellCollectible.success.title,
				description: marketplaceToastMessages.sellCollectible.success.description,
				variant: 'success',
			});

			receivedOfferModal$.delete();
		} catch (error) {
			toast({
				title: marketplaceToastMessages.sellCollectible.unkownError.title,
				description: marketplaceToastMessages.sellCollectible.unkownError.description,
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
				date={new Date(Number(order?.createdAt))}
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
