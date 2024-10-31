import { useToast } from '@0xsequence/design-system';
import { useGenerateSellTransaction } from '@react-hooks/useGenerateSellTransaction';
import { useSendTransaction } from 'wagmi';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import { Order, StepType } from '@types';
import { Address, Hex } from 'viem';
import { receivedOfferModal$ } from './_store';
import { getSellModalMessage, getSellModalTitle } from './utils';

type TransactionHandlerProps = {
	chainId: string;
	collectionAddress: string;
	tokenId: string;
	order: Order;
	collectibleName: string | undefined;
};

const useTransactionHandler = ({
	chainId,
	collectionAddress,
	tokenId,
	order,
	collectibleName,
}: TransactionHandlerProps) => {
	const { generateSellTransactionAsync, isPending: offerAccepting } =
		useGenerateSellTransaction({ chainId });
	const { sendTransactionAsync, isPending: transactionSending } =
		useSendTransaction();
	const toast = useToast();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();

	const handleSellTransaction = async () => {
		try {
			const data = await generateSellTransactionAsync({
				collectionAddress,
				buyer: order.createdBy,
				marketplace: order.marketplace,
				ordersData: [
					{
						...order,
						quantity: order.quantityInitial,
						orderId: order.orderId || '',
					},
				],
				additionalFees: [
					{
						amount: String(order.feeBps),
						receiver: order.feeBreakdown[0].recipientAddress,
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
				data: sellTransaction.data as Hex,
				value: BigInt(sellTransaction.value) || BigInt(0),
			});

			receivedOfferModal$.close();
			showTransactionStatusModal({
				hash,
				chainId,
				collectionAddress,
				tokenId,
				getTitle: (props) => getSellModalTitle(props),
				getMessage: (props) =>
					getSellModalMessage({ ...props, collectibleName }),
				creatorAddress: order?.createdBy as Address,
			});
		} catch (error) {
			receivedOfferModal$.state.messages?.sellCollectible?.onUnknownError?.();
		}
	};

	return {
		handleSellTransaction,
		offerAccepting,
		transactionSending,
	};
};

export default useTransactionHandler;
