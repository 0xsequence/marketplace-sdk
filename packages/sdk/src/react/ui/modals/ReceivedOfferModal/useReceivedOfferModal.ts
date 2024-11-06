import { useAccount } from 'wagmi';
import { useSwitchNetworkModal } from '../_internal/components/switchNetworkModal';
import { receivedOfferModal$, ReceivedOfferModalState } from './_store';

export const useReceivedOfferModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchNetworkModal();

	const openModal = (args: ReceivedOfferModalState['state']) => {
		receivedOfferModal$.open(args);
	};

	const handleShowModal = (args: ReceivedOfferModalState['state']) => {
		const isSameChain = accountChainId === Number(args.chainId);

		if (!isSameChain) {
			showSwitchNetworkModal({
				chainIdToSwitchTo: Number(args.chainId),
				onSwitchChain: () => openModal(args),
			});
			return;
		}

		openModal(args);
	};

	return {
		show: handleShowModal,
		close: () => receivedOfferModal$.close(),
	};
};
