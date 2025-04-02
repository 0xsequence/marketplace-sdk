'use client';

import { useSelectPaymentModal } from '@0xsequence/checkout';
import { ContractType } from '../../../_internal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { useLoadData } from './hooks/useLoadData';
import { usePaymentModalParams } from './hooks/usePaymentModalParams';
import { ERC1155QuantityModal } from './modals/Modal1155';
import {
	type BuyModalProps,
	buyModalStore,
	useBuyModalProps,
	useIsOpen,
	useOnError,
	useQuantity,
} from './store';

export const BuyModal = () => {
	const isOpen = useIsOpen();
	const props = useBuyModalProps();

	if (!isOpen || !props) {
		return null;
	}

	return <BuyModalContent buyModalProps={props} />;
};

const BuyModalContent = ({
	buyModalProps,
}: {
	buyModalProps: BuyModalProps;
}) => {
	const { chainId } = buyModalProps;

	const isOpen = useIsOpen();
	const onError = useOnError();

	const { openSelectPaymentModal } = useSelectPaymentModal();
	const quantity = useQuantity();

	const {
		collection,
		collectable,
		wallet,
		isLoading,
		isError,
		order,
		checkoutOptions,
	} = useLoadData();

	const {
		data: paymentModalParams,
		isLoading: isPaymentModalParamsLoading,
		isError: isPaymentModalParamsError,
	} = usePaymentModalParams({
		wallet,
		quantity,
		marketplace: order?.marketplace,
		collectableDecimals: collectable?.decimals,
		checkoutOptions: checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
	});

	if (isError || isPaymentModalParamsError) {
		onError(new Error('Error loading data'));
		return (
			<ErrorModal
				isOpen={isOpen}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Error"
			/>
		);
	}

	if (
		isLoading ||
		isPaymentModalParamsLoading ||
		!collection ||
		!collectable ||
		!order
	) {
		return (
			<LoadingModal
				isOpen={isOpen}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading Sequence Pay"
			/>
		);
	}

	if (collection.type === ContractType.ERC1155 && !quantity) {
		return <ERC1155QuantityModal order={order} />;
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else if (collection.type === ContractType.ERC721 && !quantity) {
		buyModalStore.send({ type: 'setQuantity', quantity: 1 });
	}

	if (paymentModalParams) {
		openSelectPaymentModal(paymentModalParams);
	}
};
