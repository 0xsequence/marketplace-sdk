'use client';

import {
	type SelectPaymentSettings,
	useERC1155SaleContractCheckout,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { useEffect, useRef } from 'react';
import { ContractType } from '../../../_internal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import { useLoadData } from './hooks/useLoadData';
import { useMarketPaymentModalParams } from './hooks/usePaymentModalParams';
import {
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
	const buyModalProps = useBuyModalProps();
	const { chainId, salesType, quantityDecimals, quantityRemaining } =
		buyModalProps;

	const isPrimary = salesType === 'primary';
	const isSecondary = salesType === 'secondary';

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
		currency,
	} = useLoadData();

	const {
		data: paymentModalParams,
		isLoading: isPaymentModalParamsLoading,
		isError: isPaymentModalParamsError,
	} = useMarketPaymentModalParams({
		wallet,
		quantity,
		marketplace: order?.marketplace,
		collectable: collectable,
		checkoutOptions: checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: isSecondary,
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
		(isSecondary && !collectable) ||
		(isSecondary && !order) ||
		(isPrimary && !currency)
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
		return (
			<ERC1155QuantityModal
				order={order}
				salesType={salesType}
				quantityDecimals={quantityDecimals}
				quantityRemaining={quantityRemaining}
				salePrice={
					isPrimary && currency
						? {
								amountRaw: buyModalProps.salePrice.amount,
								currency,
							}
						: undefined
				}
				chainId={chainId}
			/>
		);
	}

	// Primary Sales Contract Checkout
	if (isPrimary) {
		if (collection.type === ContractType.ERC1155) {
			return (
				<ERC1155SaleContractModalOpener
					paymentModalParams={paymentModalParams}
				/>
			);
		}
		return (
			<ERC721SaleContractModalOpener paymentModalParams={paymentModalParams} />
		);
	}

	// Secondary Sales Payments
	if (paymentModalParams) {
		return (
			<SecondarySalesPaymentModalOpener
				paymentModalParams={paymentModalParams}
			/>
		);
	}

	return null;
};

const SecondarySalesPaymentModalOpener = ({
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

const ERC721SaleContractModalOpener = () => {
	const { openCheckoutModal } = useERC1155SaleContractCheckout({
		chainId,
		salesContractAddress: buyModalProps.salesContractAddress,
		collectionAddress: buyModalProps.collectionAddress,
		items: buyModalProps.items,
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

const ERC1155SaleContractModalOpener = ({
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
