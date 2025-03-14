import { useSelector } from '@xstate/store/react';
import type { Hex } from 'viem';
import type { Order } from '../../../_internal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { useLoadData } from './hooks/useLoadData';
import { CheckoutModal } from './modals/CheckoutModal';
import { ERC1155QuantityModal } from './modals/Modal1155';
import { buyModalStore } from './store';

export const BuyModal = () => {
	const isOpen = useSelector(buyModalStore, (state) => state.context.isOpen);
	const order = useSelector(buyModalStore, (state) => state.context.order);

	if (!isOpen || !order) {
		return null;
	}

	return <BuyModalContent order={order} />;
};

const BuyModalContent = ({ order }: { order: Order }) => {
	const isOpen = useSelector(buyModalStore, (state) => state.context.isOpen);
	const view = useSelector(buyModalStore, (state) => state.context.view);
	const chainId = order.chainId;
	const collectionAddress = order.collectionContractAddress as Hex;
	const tokenId = order.tokenId;

	const { collectable, collection, checkoutOptions, isLoading, isError } =
		useLoadData({
			chainId,
			collectionAddress,
			orderId: order.orderId,
			marketplace: order.marketplace,
			collectibleId: tokenId,
		});

	if (isLoading) {
		return (
			<LoadingModal
				isOpen={isOpen}
				chainId={Number(chainId)}
				onClose={() => buyModalStore.trigger.close()}
				title="Loading Sequence Pay"
				data-testid="loading-spinner"
			/>
		);
	}

	if (isError || !collection || !collectable) {
		buyModalStore.trigger.setView({ view: 'error' });
		return (
			<ErrorModal
				isOpen={isOpen}
				chainId={Number(chainId)}
				onClose={() => buyModalStore.trigger.close()}
				title="Error"
				data-testid="error-modal"
			/>
		);
	}

	if (collection.type === 'ERC1155') {
		buyModalStore.trigger.setView({ view: 'quantity' });
	}

	if (view === 'quantity') {
		return (
			<ERC1155QuantityModal
				buy={handleBuy}
				order={order}
				collectable={collectable}
				chainId={chainId}
				collectionAddress={collectionAddress}
				collectibleId={tokenId}
			/>
		);
	}

	return (
		<CheckoutModal
			buy={handleBuy}
			order={loadedOrder || order}
			collectable={collectable}
			isLoading={isBuyLoading}
		/>
	);
};
