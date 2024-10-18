import { ContractType } from '@0xsequence/indexer';
import { observer } from '@legendapp/state/react';
import { useCollection } from '@react-hooks/useCollection';
import { useState } from 'react';
import { ActionModal } from '../_internal/components/actionModal/ActionModal';
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
	const [quantity, setQuantity] = useState('1');
	const { chainId, collectionAddress, collectibleId } =
		makeOfferModal$.state.get();
	const { data: collection, isLoading: collectionLoading } = useCollection({
		chainId,
		collectionAddress,
	});
	const offerPrice$ = makeOfferModal$.state.offerPrice;

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
			ctas={[
				{
					label: 'Make offer',
					onClick: async () => {
						// make offer
					},
				},
			]}
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
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
					quantity={quantity}
					setQuantity={setQuantity}
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
