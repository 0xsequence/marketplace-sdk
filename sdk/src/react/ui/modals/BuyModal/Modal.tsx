'use client';

import {
	type SelectPaymentSettings,
	useERC1155SaleContractCheckout,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { useEffect, useRef } from 'react';
import { ContractType, StoreType } from '../../../_internal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import { useLoadData } from './hooks/useLoadData';
import { usePaymentModalParams } from './hooks/usePaymentModalParams';
import {
	type CheckoutOptionsSalesContractProps,
	buyModalStore,
	useBuyModalProps,
	useIsOpen,
	useOnError,
	useQuantity,
} from './store';

export const BuyModal = () => {
	const isOpen = useIsOpen();

	if (!isOpen) {
		return null;
	}

	return <BuyModalContent />;
};

const BuyModalContent = () => {
	const { chainId, storeType } = useBuyModalProps();

	const onError = useOnError();

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
		collectable: collectable,
		checkoutOptions: checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: storeType === StoreType.MARKETPLACE,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: we want to set this on collection change
	useEffect(() => {
		if (collection?.type === ContractType.ERC721 && !quantity) {
			buyModalStore.send({ type: 'setQuantity', quantity: 1 });
		}
	}, [collection]);

	if (isError || isPaymentModalParamsError) {
		onError(new Error('Error loading data'));
		return (
			<ErrorModal
				isOpen={true}
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
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading Sequence Pay"
			/>
		);
	}

	if (collection.type === ContractType.ERC1155 && !quantity) {
		return <ERC1155QuantityModal order={order} />;
	}

	if (paymentModalParams) {
		return <PaymentModalOpener paymentModalParams={paymentModalParams} />;
	}
};

const PaymentModalOpener = ({
	paymentModalParams,
}: {
	paymentModalParams: SelectPaymentSettings;
}) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const hasOpenedRef = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!hasOpenedRef.current) {
			hasOpenedRef.current = true;
			openSelectPaymentModal(paymentModalParams);
		}
	}, []);

	return null;
};

const SaleContractCheckoutModalOpener = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	accountAddress,
}: CheckoutOptionsSalesContractProps) => {
	const { openCheckoutModal } = useERC1155SaleContractCheckout({
		chain: chainId,
		contractAddress: salesContractAddress,
		collectionAddress,
		items,
		wallet: accountAddress,
	});
	const hasOpenedRef = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!hasOpenedRef.current) {
			hasOpenedRef.current = true;
			openCheckoutModal();
		}
	}, []);

	return null;
};
