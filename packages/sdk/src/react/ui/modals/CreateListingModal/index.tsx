import { Box } from '@0xsequence/design-system';
import { Show, observer } from '@legendapp/state/react';
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
import TransactionDetails from '../_internal/components/transactionDetails';
import { createListingModal$, useHydrate } from './_store';
import {
	CreateListingErrorCallbacks,
	CreateListingSuccessCallbacks,
} from '../../../../types/callbacks';
import { ContractType } from '../../../_internal';

export type ShowCreateListingModalArgs = {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
};

export const useCreateListingModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchChainModal();
	const { errorCallbacks, successCallbacks } = createListingModal$.state.get();

	const openModal = (args: ShowCreateListingModalArgs) => {
		createListingModal$.open(args);
	};

	const handleShowModal = (args: ShowCreateListingModalArgs) => {
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
		close: () => createListingModal$.close(),
		onError: (callbacks: CreateListingErrorCallbacks) => {
			createListingModal$.state.set({
				...createListingModal$.state.get(),
				errorCallbacks: callbacks,
			});
		},
		onSuccess: (callbacks: CreateListingSuccessCallbacks) => {
			createListingModal$.state.set({
				...createListingModal$.state.get(),
				successCallbacks: callbacks,
			});
		},
	};
};

export const CreateListingModal = () => {
	return (
		<Show if={createListingModal$.isOpen}>
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
		listingPrice,
	} = createListingModal$.state.get();

	const { steps } = createListingModal$.get();

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: steps.tokenApproval.execute,
			hidden: !steps.tokenApproval.isNeeded(),
			pending: steps.tokenApproval.pending,
			variant: 'glass' as const,
		},
		{
			label: 'List item for sale',
			onClick: steps.createListing.execute,
			pending: steps.createListing.pending,
			disabled:
				steps.tokenApproval.isNeeded() || listingPrice.amountRaw === '0',
		},
	] satisfies ActionModalProps['ctas'];

	return (
		<ActionModal
			store={createListingModal$}
			onClose={() => createListingModal$.close()}
			title="List item for sale"
			ctas={ctas}
		>
			<TokenPreview
				collectionName={collectionName}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
				chainId={chainId}
			/>

			<Box display="flex" flexDirection="column" width="full" gap="1">
				<PriceInput
					chainId={chainId}
					collectionAddress={collectionAddress}
					$listingPrice={createListingModal$.state.listingPrice}
				/>
				{!!listingPrice && (
					<FloorPriceText
						tokenId={collectibleId}
						chainId={chainId}
						collectionAddress={collectionAddress}
						price={listingPrice}
					/>
				)}
			</Box>

			{collectionType === ContractType.ERC1155 && (
				<QuantityInput
					chainId={chainId}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
					$quantity={createListingModal$.state.quantity}
				/>
			)}

			<ExpirationDateSelect $date={createListingModal$.state.expiry} />

			<TransactionDetails
				collectibleId={collectibleId}
				collectionAddress={collectionAddress}
				chainId={chainId}
				price={createListingModal$.state.listingPrice.get()}
			/>
		</ActionModal>
	);
});
