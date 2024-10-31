import {
	ActionModal,
	ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { sellModal$, useHydrate } from './_store';
import { observer, Show } from '@legendapp/state/react';
import { useCollection } from '@react-hooks/useCollection';
import { Order, Price } from '@types';
import TransactionHeader from '../_internal/components/transactionHeader';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import {
	ApproveTokenMessageCallbacks,
	SellCollectibleMessageCallbacks,
	SwitchChainMessageCallbacks,
} from '@internal';
import { useCurrencies } from '@react-hooks/useCurrencies';

export type ShowSellModalArgs = {
	chainId: string;
	collectionAddress: string;
	tokenId: string;
	order: Order;
	collectibleName: string | undefined;
	messages?: {
		approveToken?: ApproveTokenMessageCallbacks;
		sellCollectible?: SellCollectibleMessageCallbacks;
		switchChain?: SwitchChainMessageCallbacks;
	};
};

export const useSellModal = () => {
	return {
		show: (args: ShowSellModalArgs) => sellModal$.open(args),
		close: () => sellModal$.close(),
	};
};

export const SellModal = () => {
	return (
		<Show if={sellModal$.isOpen}>
			<Modal />
		</Show>
	);
};

const Modal = () => {
	useHydrate();
	return <ModalContent />;
};

const ModalContent = observer(() => {
	const modalState = sellModal$.state.get();
	const { collectionAddress, chainId, tokenId, order } = modalState;

	const { steps } = sellModal$.get();

	const { data: collection } = useCollection({ chainId, collectionAddress });
	const { data: currencies } = useCurrencies({ chainId, collectionAddress });
	const currency = currencies?.find(
		(currency) => currency.contractAddress === order?.priceCurrencyAddress,
	);

	const ctas = [
		{
			label: 'Approve TOKEN',
			onClick: steps.tokenApproval.execute,
			hidden: !steps.tokenApproval.isNeeded(),
			pending: steps.tokenApproval.pending,
			variant: 'glass' as const,
		},
		{
			label: 'Accept',
			onClick: steps.sell.execute,
			pending: steps.sell.pending,
			disabled: steps.switchChain.isNeeded() || steps.tokenApproval.isNeeded(),
		},
	] satisfies ActionModalProps['ctas'];

	return (
		<ActionModal
			store={sellModal$}
			onClose={() => sellModal$.close()}
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
				price={
					currency
						? ({ amountRaw: order?.priceAmount, currency } as Price)
						: undefined
				}
			/>
		</ActionModal>
	);
});
