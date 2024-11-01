import { Box } from '@0xsequence/design-system';
import { ContractType } from '@internal';
import { Show, observer } from '@legendapp/state/react';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import { createListingModal$, useHydrate } from './_store';
import { useAccount } from 'wagmi';
import { useSwitchChainModal } from '../_internal/components/switchChainModal';
import { Messages } from '../../../../types/messages';

export type ShowCreateListingModalArgs = {
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	messages?: Messages;
};

export const useCreateListingModal = () => {
	const { chainId: accountChainId } = useAccount();
	const { show: showSwitchNetworkModal } = useSwitchChainModal();

	const openModal = (args: ShowCreateListingModalArgs) => {
		createListingModal$.open(args);
	};

	const handleShowModal = (args: ShowCreateListingModalArgs) => {
		const isSameChain = accountChainId === Number(args.chainId);

		if (!isSameChain) {
			showSwitchNetworkModal({
				chainIdToSwitchTo: Number(args.chainId),
				onSwitchChain: () => openModal(args),
				messages: args.messages?.switchChain,
			});
			return;
		}

		openModal(args);
	};

	return {
		show: handleShowModal,
		close: () => createListingModal$.close(),
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

	const ctas =
		createListingModal$.steps.stepsData.get() === undefined
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
						label: 'List item for sale',
						onClick: steps.createListing.execute,
						pending: steps.createListing.pending,
						disabled: steps.tokenApproval.isNeeded() || !listingPrice.amountRaw,
					},
				] satisfies ActionModalProps['ctas']);

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
