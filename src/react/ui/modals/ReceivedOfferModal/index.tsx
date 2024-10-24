import { useAccount } from 'wagmi';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { receivedOfferModal$, type ReceivedOfferModalState } from './_store';
import { observer } from '@legendapp/state/react';
import { useCollection } from '@react-hooks/useCollection';
import { useSwitchNetworkModal } from '../_internal/components/switchNetworkModal';

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

	return (
		order && (
			<ActionModal
				store={receivedOfferModal$}
				onClose={() => receivedOfferModal$.close()}
				title="You have an offer"
				ctas={[
					{
						label: 'Accept',
						onClick: async () => {
							console.log('Accept offer');
						},
					},
				]}
			>
				<TransactionHeader
					title="Offer received"
					chainId={Number(chainId)}
					date={new Date(Number(order.createdAt))}
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
		)
	);
});
