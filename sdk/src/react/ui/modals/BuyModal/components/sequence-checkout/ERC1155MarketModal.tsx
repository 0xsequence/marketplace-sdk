'use client';

import type { Order, TokenMetadata } from '@0xsequence/api-client';
import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { useEffect } from 'react';
import type { Address } from 'viem';
import { ActionModal } from '../../../_internal/components/baseModal';
import {
	buyModalStore,
	isShopProps,
	useBuyModalProps,
	usePaymentModalState,
	useQuantity,
} from '../../store';
import { usePaymentModalParams } from './_hooks/usePaymentModalParams';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';

interface ERC1155MarketModalProps {
	collectable: TokenMetadata;
	order: Order;
	address: Address | undefined;
	chainId: number;
}

export const ERC1155MarketModal = ({
	collectable,
	order,
	address,
	chainId,
}: ERC1155MarketModalProps) => {
	const quantity = useQuantity();
	const modalProps = useBuyModalProps();
	const cardType = modalProps.cardType || 'market';
	const isShop = isShopProps(modalProps);
	const quantityDecimals = isShop
		? modalProps.quantityDecimals
		: collectable.decimals || 0;
	const quantityRemaining = isShop
		? modalProps.quantityRemaining
		: order?.quantityRemaining;
	const paymentModalParams = usePaymentModalParams({
		address,
		quantity,
		marketplace: order?.marketplace,
		collectable,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: true,
	});
	useEffect(() => {
		if (modalProps.hideQuantitySelector && !quantity) {
			buyModalStore.send({
				type: 'setQuantity',
				quantity: 1,
			});
		}
	}, [
		modalProps.hideQuantitySelector,
		quantity,
		quantityDecimals,
		quantityRemaining,
	]);

	if (!quantity && !modalProps.hideQuantitySelector) {
		return (
			<ERC1155QuantityModal
				order={order}
				cardType={cardType}
				quantityDecimals={quantityDecimals}
				quantityRemaining={quantityRemaining}
				chainId={chainId}
			/>
		);
	}

	return (
		<ActionModal
			chainId={order.chainId}
			type="buy"
			queries={{ paymentModalParams }}
			onErrorDismiss={() => {
				buyModalStore.send({ type: 'close' });
			}}
			onErrorAction={() => {
				buyModalStore.send({ type: 'close' });
			}}
			onClose={() => {
				buyModalStore.send({ type: 'close' });
			}}
			title="Checkout"
			primaryAction={{
				label: 'Close',
				onClick: () => {
					buyModalStore.send({ type: 'close' });
				},
			}}
		>
			{({ paymentModalParams }) => {
				return <PaymentModalOpener paymentModalParams={paymentModalParams} />;
			}}
		</ActionModal>
	);
};

interface PaymentModalOpenerProps {
	paymentModalParams: SelectPaymentSettings;
}

const PaymentModalOpener = ({
	paymentModalParams,
}: PaymentModalOpenerProps) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const paymentModalState = usePaymentModalState();

	useEffect(() => {
		if (paymentModalState === 'idle') {
			buyModalStore.send({ type: 'openPaymentModal' });
			openSelectPaymentModal(paymentModalParams);
			buyModalStore.send({ type: 'paymentModalOpened' });
		}
	}, [paymentModalState, paymentModalParams, openSelectPaymentModal]);

	return null;
};
