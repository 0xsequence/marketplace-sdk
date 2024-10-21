import { ContractType, StepType } from '@internal';
import { observer } from '@legendapp/state/react';
import { useCollection } from '@react-hooks/useCollection';
import { useGenerateOfferTransaction } from '@react-hooks/useGenerateOfferTransaction';
import { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import ExpirationDateSelect from '../_internal/components/expirationDateSelect';
import FloorPriceText from '../_internal/components/floorPriceText';
import PriceInput from '../_internal/components/priceInput';
import QuantityInput from '../_internal/components/quantityInput';
import TokenPreview from '../_internal/components/tokenPreview';
import { makeOfferModal$ } from './_store';

export type ShowMakeOfferModalArgs = {
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
};

export const useMakeOfferModal = () => {
	return {
		show: (args: ShowMakeOfferModalArgs) => makeOfferModal$.open(args),
		close: () => makeOfferModal$.close(),
	};
};

export const MakeOfferModal = observer(() => {
	return makeOfferModal$.isOpen.get() ? <Modal /> : null;
});

const Modal = observer(() => {
	const { chainId, collectionAddress, collectibleId } =
		makeOfferModal$.state.get();

	const { data: collection, isLoading: collectionLoading } = useCollection({
		chainId,
		collectionAddress,
	});

	const offerPrice$ = makeOfferModal$.state.offerPrice;

	const { chainId: currentChainId } = useAccount();

	const { data, isSuccess } = useGenerateOfferTransaction({
		chainId: chainId,
	});

	const [tokenApprovalNeeded, setTokenApprovalNeeded] = useState(false);

	// Call generateListingTransaction if the currency is changed, to check if token approval is needed
	// useObserve(offerPrice$.currency.contractAddress, ({ value }) => {
	// 	generateOfferTransaction({
	// 		collectionAddress,
	// 		orderbook: OrderbookKind.sequence_marketplace_v1,
	// 		offer: {
	// 			tokenId: '1',
	// 			quantity: '1',
	// 			expiry: Date.now().toString(),
	// 			// biome-ignore lint/style/noNonNullAssertion: <explanation>
	// 			currencyAddress: value!,
	// 			pricePerToken: '0',
	// 		},
	// 		// biome-ignore lint/style/noNonNullAssertion: <explanation>
	// 		maker: accountAddress!,
	// 		contractType: ContractType.ERC721,
	// 	});
	// });

	if (isSuccess) {
		setTokenApprovalNeeded(
			!!data?.steps.some((step) => step.id === StepType.tokenApproval),
		);
	}

	const { switchChainAsync } = useSwitchChain();
	const [switchChainPending, setSwitchChainPending] = useState(false);
	const handleSwitchChain = async () => {
		setSwitchChainPending(true);
		await switchChainAsync({ chainId: Number(chainId) });
		setSwitchChainPending(false);
	};

	const [approveTokenPending, setApproveTokenPending] = useState(false);
	const handleApproveToken = async () => {
		setApproveTokenPending(true);
		console.log('Approve token');
		console.log(data);
		setApproveTokenPending(false);
	};

	const [createOfferPending, setCreateOfferPending] = useState(false);
	const handleCreateOffer = async () => {
		setCreateOfferPending(true);

		setCreateOfferPending(false);
	};

	const ctas = [
		{
			label: 'Switch chain',
			onClick: handleSwitchChain,
			hidden: Number(chainId) === currentChainId,
			pending: switchChainPending,
			variant: 'glass' as const,
		},
		{
			label: 'Approve TOKEN',
			onClick: handleApproveToken,
			hidden: !tokenApprovalNeeded,
			pending: approveTokenPending,
			variant: 'glass' as const,
		},
		{
			label: 'Make offer',
			onClick: handleCreateOffer,
			pending: createOfferPending,
		},
	] satisfies ActionModalProps['ctas'];

	if (collectionLoading) {
		return null;
	}

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
				collectionName={collection?.name}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
				chainId={chainId}
			/>

			<PriceInput
				chainId={chainId}
				collectionAddress={collectionAddress}
				$listingPrice={offerPrice$}
			/>

			{collection?.type === ContractType.ERC1155 && (
				<QuantityInput
					chainId={chainId}
					$quantity={makeOfferModal$.state.quantity}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
				/>
			)}

			{!!offerPrice$.get() && (
				<FloorPriceText
					chainId={chainId}
					collectionAddress={collectionAddress}
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					price={offerPrice$.get()!}
				/>
			)}

			<ExpirationDateSelect />
		</ActionModal>
	);
});
