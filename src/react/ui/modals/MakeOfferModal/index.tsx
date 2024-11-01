import { ContractType } from '@internal';
import { Show, observer } from '@legendapp/state/react';
import { type Hex, erc20Abi } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import { makeOfferModal$, useHydrate } from './_store';
import { useSwitchChainModal } from '../_internal/components/switchChainModal';

export type ShowMakeOfferModalArgs = {
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
};

export const useMakeOfferModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchChainModal();

	const openModal = (args: ShowMakeOfferModalArgs) => {
		makeOfferModal$.open(args);
	};

	const handleShowModal = (args: ShowMakeOfferModalArgs) => {
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
		close: () => makeOfferModal$.close(),
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
	const {
		chainId,
		collectionAddress,
		collectibleId,
		collectionName,
		collectionType,
		offerPrice,
	} = makeOfferModal$.state.get();

	const { steps } = makeOfferModal$.get();

	const { address } = useAccount();
	const { data: balance } = useReadContract({
		address,
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: [
			makeOfferModal$.state.offerPrice.currency.contractAddress.get() as Hex,
		],
	});

	let balanceError = '';
	if (
		BigInt(makeOfferModal$.state.offerPrice.get().amountRaw) > (balance || 0)
	) {
		balanceError = 'Insufficient balance';
	}

	const ctas =
		makeOfferModal$.steps.stepsData.get() === undefined
			? []
			: ([
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
							!makeOfferModal$.state.offerPrice.amountRaw.get(),
					},
				] satisfies ActionModalProps['ctas']);

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
				error={balanceError}
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
					chainId={chainId}
					collectionAddress={collectionAddress}
					price={offerPrice}
				/>
			)}

			<ExpirationDateSelect $date={makeOfferModal$.state.expiry} />
		</ActionModal>
	);
});
