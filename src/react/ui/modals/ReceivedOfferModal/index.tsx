import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import { receivedOfferModal$ } from './_store';
import { observer } from '@legendapp/state/react';
import { useCollection } from '@react-hooks/useCollection';
import { useApproveToken } from '@react-hooks/useApproveToken';
import { ContractType } from '@types';
import TransactionHeader from '../_internal/components/transactionHeader';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { useCollectible } from '@react-hooks/useCollectible';
import useTransactionHandler from './SellTransactionHandler';

export const ReceivedOfferModal = observer(() => {
	const modalState = receivedOfferModal$.state.get();
	const { collectionAddress, chainId, tokenId, order, price } = modalState;

	const { data: collection } = useCollection({ chainId, collectionAddress });
	const { data: collectible } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId: tokenId,
	});

	const { tokenApprovalNeeded, approveToken, result } = useApproveToken({
		chainId,
		collectionAddress,
		collectionType: collection?.type as ContractType,
		tokenId,
	});

	const { handleSellTransaction, offerAccepting, transactionSending } =
		useTransactionHandler({
			chainId,
			collectionAddress,
			tokenId,
			order: order!,
			collectibleName: collectible?.name,
		});

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
	];

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
