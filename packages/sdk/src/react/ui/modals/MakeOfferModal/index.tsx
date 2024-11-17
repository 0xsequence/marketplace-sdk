import { ContractType } from '#internal';
import { Show, observer } from '@legendapp/state/react';
import { useState } from 'react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import { useSwitchChainModal } from '../_internal/components/switchChainModal';
import TokenPreview from '../_internal/components/tokenPreview';
import { makeOfferModal$, useHydrate } from './_store';
import {
	MakeOfferErrorCallbacks,
	MakeOfferSuccessCallbacks,
} from '../../../../types/callbacks';

export type ShowMakeOfferModalArgs = {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
};

export const useMakeOfferModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchChainModal();
	const { errorCallbacks, successCallbacks } = makeOfferModal$.state.get();

	const openModal = (args: ShowMakeOfferModalArgs) => {
		makeOfferModal$.open(args);
	};

	const handleShowModal = (args: ShowMakeOfferModalArgs) => {
		const isSameChain = accountChainId === Number(args.chainId);

		if (!isSameChain) {
			showSwitchNetworkModal({
				chainIdToSwitchTo: Number(args.chainId),
				onSwitchChain: () => openModal(args),
				callbacks: {
					onSuccess: successCallbacks?.onSwitchChainSuccess,
					onUnknownError: errorCallbacks?.onSwitchChainError,
					onSwitchingNotSupported: errorCallbacks?.onSwitchingNotSupportedError,
					onUserRejectedRequest:
						errorCallbacks?.onUserRejectedSwitchingChainRequestError,
				},
			});
			return;
		}

		openModal(args);
	};

	return {
		show: handleShowModal,
		close: () => makeOfferModal$.close(),
		onError: (callbacks: MakeOfferErrorCallbacks) => {
			makeOfferModal$.state.set({
				...makeOfferModal$.state.get(),
				errorCallbacks: callbacks,
			});
		},
		onSuccess: (callbacks: MakeOfferSuccessCallbacks) => {
			makeOfferModal$.state.set({
				...makeOfferModal$.state.get(),
				successCallbacks: callbacks,
			});
		},
	};
};

export const MakeOfferModal = () => {
	return (
		<Show if={makeOfferModal$.isOpen}>
			<Modal />
		</Show>
	);
};

const Modal = () => {
	useHydrate();
	return <ModalContent />;
};

const ModalContent = observer(() => {
	const [insufficientBalance, setInsufficientBalance] = useState(false);
	const {
		chainId,
		collectionAddress,
		collectibleId,
		collectionName,
		collectionType,
		offerPrice,
	} = makeOfferModal$.state.get();

	const { steps } = makeOfferModal$.get();

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: steps.tokenApproval.execute,
			hidden: !steps.tokenApproval.isNeeded(),
			pending: steps.tokenApproval.pending,
			variant: 'glass' as const,
		},
		{
			label: 'Make offer',
			onClick: steps.createOffer.execute,
			pending: steps.createOffer.pending,
			disabled:
				steps.tokenApproval.isNeeded() ||
				offerPrice.amountRaw === '0' ||
				insufficientBalance,
		},
	] satisfies ActionModalProps['ctas'];

	return (
		<ActionModal
			store={makeOfferModal$}
			onClose={() => {
				makeOfferModal$.close();
			}}
			title="Make an offer"
			ctas={ctas}
		>
			<TokenPreview
				collectionName={collectionName}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
				chainId={chainId}
			/>

			<PriceInput
				chainId={chainId}
				collectionAddress={collectionAddress}
				$listingPrice={makeOfferModal$.state.offerPrice}
				checkBalance={{
					enabled: true,
					callback: (state) => setInsufficientBalance(state),
				}}
			/>

			{collectionType === ContractType.ERC1155 && (
				<QuantityInput
					chainId={chainId}
					$quantity={makeOfferModal$.state.quantity}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
				/>
			)}

			{!!offerPrice && (
				<FloorPriceText
					tokenId={collectibleId}
					chainId={chainId}
					collectionAddress={collectionAddress}
					price={offerPrice}
				/>
			)}

			<ExpirationDateSelect $date={makeOfferModal$.state.expiry} />
		</ActionModal>
	);
});
